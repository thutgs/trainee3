import { filter, map, scan, merge, of, retry, catchError, withLatestFrom,tap, MonoTypeOperatorFunction, mergeMap } from 'rxjs';
import { gps$ } from '../streams/gps.stream';
import { alertas$ } from '../streams/alertas.stream';
import { pedidos$ } from '../streams/pedidos.stream';

// --- TRANSFORMAÇÕES E FILTRAGENS  ---

// Filtrar velocidade > 60 km/h
export const velocidadeSuspeita$ = gps$.pipe(
  filter(dados => dados.velocidade > 60)
);

// Enriquecer com Região (Norte/Sul)
export const gpsEnriquecido$ = gps$.pipe(
  map(dados => ({
    ...dados, // ... é o operador de espalhamento que copia todas as propriedades do objeto original
    regiao: dados.lat > 0 ? 'Norte' : 'Sul' // Regra de latitude lat > 0 = Norte, lat <= 0 = Sul
  }))
);

// Severidade 'alta' ou 'media' 
export const alertasCriticos$ = alertas$.pipe(
  filter(alerta => alerta.severidade === 'alta' || alerta.severidade === 'media')
);

// Contagem de status 
export const statusCount$ = pedidos$.pipe(
  scan((acumulador, pedido) => { // scan é um operador do RxJS que acumula valores ao longo do tempo,
  //  emitindo o valor acumulado a cada nova emissão
    const status = pedido.status;
    if (!status) return acumulador; // Se não tiver status, retorna o acumulador sem alterações
    //  Inseri esse if pois o TS estava reclamando que o status poderia ser undefined
    return {
      ...acumulador,
      [status]: (acumulador[status as keyof typeof acumulador] || 0) + 1 // Incrementa a contagem do status atual, usando o valor anterior ou 0 se ainda não existir
    };
  }, { coletado: 0, em_rota: 0, entregue: 0, falhou: 0 }) // Valor inicial do objeto 
);


// --- Painel do entregador ---

// Criamos um tipo para o estado dos entregadores para facilitar a manipulação e garantir que tenhamos as propriedades corretas
type EstadoEntregadores = { [id: string]: any };

// aqui usamos o merge para combinar os streams de GPS e Pedidos,
// e o scan para acumular o estado dos entregadores ao longo do tempo
export const painelEntregador$ = merge(
  gps$.pipe(map(d => ({ ...d, tipo: 'gps' }))), // adicionamos um tipo para diferenciar os dados de GPS dos dados de pedidos
  pedidos$.pipe(
    map(d => ({ ...d, tipo: 'pedido' })) // tipo "pedido"
  )
).pipe(
  // usamos o scan para acumular as informações de GPS e pedidos por entregador,
  // emitindo o acumulador a cada novo dado
  scan((acc: EstadoEntregadores, curr: any) => { // nesse caso acc é o estado acumulado dos entregadores e
  // curr é o dado atual, que pode ser tanto um GPS quanto um pedido

    const id = curr.entregadorId; // pegando o ID do entregador para usar como chave no acumulador
    const novoEstado = { ...acc }; // cria uma cópia do estado anterior

    // Se o entregador não existe no acumulador, ele seguirá esse molde
    if (!novoEstado[id]) {
      novoEstado[id] = { 
        lat: 0, 
        lng: 0, 
        velocidade: 0, 
        regiao: 'Calculando...',
        status: 'Aguardando...',
        atualizacao: new Date()
      };
    }

    const dados = { ...novoEstado[id] }; // cria uma cópia do estado atual do entregador para atualizar


    // se o dado atual for do tipo GPS, atualizamos as informações de localização e região,
    // caso contrário, atualizamos o status do pedido
    if (curr.tipo === 'gps') {
      dados.lat = curr.lat;
      dados.lng = curr.lng;
      dados.velocidade = curr.velocidade; 
      dados.regiao = curr.lat > 0 ? 'Norte' : 'Sul'; // inseri a região como algo extra
    } else {
      dados.status = curr.status;
    }

    dados.atualizacao = new Date(); // atualiza o timestamp da última atualização, seja de GPS ou pedido
    novoEstado[id] = dados; // atualiza o estado do entregador no acumulador com as novas informações
    return novoEstado;
  }, {}),

  // formatando como uma "tabela"
  map(acc => Object.entries(acc).map(([id, dados]) => ({
    entregadorId: id,
    lat: dados.lat ? dados.lat.toFixed(2) : 0, // toFixed(2) é um método que formata o número para ter apenas 2 casas decimais
    lng: dados.lng ? dados.lng.toFixed(2) : 0,
    velocidade: dados.velocidade, 
    regiao: dados.regiao,
    ultimoStatus: dados.status,
    ultimaAtualizacao: dados.atualizacao.toLocaleTimeString() // transoforma o timestamp em um formato de hora mais legível
  })))
);


// --- Dashboard de Emergências ---

// Criando uma stream que mantém os GPS dos últimos 5 segundos
const gpsRecentes$ = gps$.pipe(
  scan((acc: any[], atual: any) => { // usamos any[] para o acumulador pois ele é uma lista de objetos de GPS
    const agora = new Date().getTime();
    // adiciona o novo GPS e remove quem tem mais de 5 segundos
    return [...acc, atual].filter(g => (agora - new Date(g.timestamp).getTime()) <= 5000);
  }, [])
);

export const emergencia$ = alertas$.pipe(
  filter(alerta => alerta.severidade === 'alta'), // só queremos alertas de severidade alta para emergências
  
  // juntamos com os 5 GPS recentes para verificar se o entregador do alerta estava acima de 60km/h nos últimos 5 segundos
  withLatestFrom(gpsRecentes$), // withLatestFrom é um operador do RxJS que combina o valor de um Observable principal (alertas$)
  //  com o valor mais recente de outro Observable (gpsRecentes$)
  
  // transformamos o alerta em múltiplas emissões (uma para cada GPS infrator), e por isso usamos mergeMap ao invés de map
  mergeMap(([alerta, listaGps]) => {
    // filtra-se na lista quem é o mesmo entregador e estava acima de 60km/h
    const infrações = listaGps.filter(g => 
      g.entregadorId === alerta.entregadorId && g.velocidade > 60
    );
    
    // Retornamos um array de emergências, de modo que o RxJS emita uma por uma)
    return infrações.map(gpsInfrator => ({
      tipo: 'EMERGÊNCIA',
      entregadorId: alerta.entregadorId,
      velocidade: gpsInfrator.velocidade,
      dataGps: new Date(gpsInfrator.timestamp).toLocaleTimeString(),
      motivo: alerta.tipo
    }));
  })
);


// Operador personalizado para logar com timestamp
// MonoTypeOperatorFunction é um tipo do RxJS que representa um operador que recebe e retorna o mesmo tipo de dado,
// garantindo que o operador seja genérico e possa ser usado com qualquer tipo de Observable
export function logComTimestamp<T>(prefixo: string): MonoTypeOperatorFunction<T> {
  return tap(valor => { // tap é um operador do RxJS que permite executar efeitos colaterais (como logging) sem alterar os dados que passam pelo stream
    const agora = new Date().toLocaleTimeString(); // formata o timestamp para mostrar apenas a hora, minuto e segundo
    console.log(`[${agora}] [${prefixo.toUpperCase()}]`, valor);
  });
}
