import { Subject, takeUntil, timer, retry, catchError, of } from 'rxjs';
import { gps$ } from './streams/gps.stream';
import { pedidos$ } from './streams/pedidos.stream';
import { alertas$ } from './streams/alertas.stream';
import{ logComTimestamp, painelEntregador$, emergencia$, 
velocidadeSuspeita$, gpsEnriquecido$, statusCount$, alertasCriticos$ } from './operadores/custom.operadores';


// Aqui usamos um subject pois ele consegue emitir um valor para múltiplos observadores,
// o que é ideal para controlar o término de múltiplas subscrições ao mesmo tempo.
const destroy$ = new Subject<void>();

console.log('--- Iniciando Sistema de Monitoramento Reativo (30s) ---');

// --- STREAMS ORIGINAIS ---

// o takeUntil é um operador do RxJS que permite que um Observable emita valores até que outro
//  Observable (neste caso, destroy$) emita um valor ou complete
// Assim, o takeUntil garante que hajam as desinscrições corretas dos Observables

gps$.pipe(takeUntil(destroy$)).subscribe({
  next: (dado) => console.log('[GPS]', dado),
  error: (err) => console.error('[ERRO GPS]', err.message)
});

pedidos$.pipe(
  takeUntil(destroy$),
  retry(3), // Tenta novamente 3 vezes antes de lançar o erro para o catchError,
  //  então só será apresentado um erro se tiver falha 4 vezes seguidas
  catchError(err => of({ status: 'erro', mensagem: err.message }))
  // Emite um objeto de erro para o fluxo, mas não para o sistema inteiro, permitindo
  // que continue funcionando mesmo com erros ocasionais
).subscribe(dado => console.log('[PEDIDO]', dado));

alertas$.pipe(takeUntil(destroy$),
logComTimestamp('Alerta')).subscribe(); // inserimos o operador de log personalizado para mostrar os alertas com timestamp e prefixo no console

painelEntregador$.pipe(takeUntil(destroy$)).subscribe(painel => {
  console.log('=== PAINEL CONSOLIDADO ===');
  console.table(painel); // utilizando console.table para uma visualização alinhada com o formato de painel
});

emergencia$.pipe(takeUntil(destroy$),
logComTimestamp('Emergência')).subscribe(); // inserimos o operador de log personalizado para mostrar as emergências com timestamp e prefixo no console

// --- OPERADORES PROCESSADOS  ---

// Velocidade Suspeita (> 60 km/h) 
velocidadeSuspeita$.pipe(takeUntil(destroy$)).subscribe(dado => {
  console.log(`[SUSPEITO] Entregador ${dado.entregadorId} a ${dado.velocidade}km/h`);
});

// Placar de Status Acumulado (scan) 
statusCount$.pipe(takeUntil(destroy$)).subscribe(contagem => {
  console.log('[CONTADOR STATUS]', contagem);
});

// Alertas Críticos (Alta/Média) 
alertasCriticos$.pipe(takeUntil(destroy$)).subscribe(alerta => {
  console.log(`[CRÍTICO] ${alerta.tipo?.toUpperCase()} - Severidade: ${alerta.severidade}`);
});

// GPS Enriquecido (Região Norte/Sul) 
gpsEnriquecido$.pipe(takeUntil(destroy$)).subscribe(dado => {
  console.log(`[REGIÃO] ${dado.entregadorId} está na zona: ${dado.regiao}`);
});

// Temporizador de Encerramento (30 segundos)
timer(30000).subscribe(() => {
  console.log('\n--- Encerrando Monitoramento após 30 segundos ---');
  destroy$.next(); // Emite o sinal de parada 
  destroy$.complete(); // Fecha o Subject de controle 
});