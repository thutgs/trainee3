import { interval, throwError, mergeMap, of, share } from 'rxjs';

export const pedidos$ = interval(2000).pipe(
  mergeMap(() => { // mergeMap é um operador do RxJS que mapeia cada valor para um Observable diferente, sendo necessário por conta do erro simulado
    // Simula a probabilidade de erro de 10% 
    const deuErro = Math.random() < 0.1;

    if (deuErro) {
      // Lança o erro, o que pararia o stream, por isso a necessidade de usar catchError e Retry no main.ts
      // para garantir que o sistema continue funcionando mesmo com erros ocasionais
      return throwError(() => new Error('Falha na comunicação com o servidor'));
    }

    // Caso não dê erro, emite o objeto de pedido padrão 
    // utilizamos o array dessa forma para garantir que o status seja corretamente inserido como uma dessas opções
    const statusOptions: ('coletado' | 'em_rota' | 'entregue' | 'falhou')[] = 
      ['coletado', 'em_rota', 'entregue', 'falhou'];

    return of({
      pedidoId: `PED-${Math.floor(Math.random() * 1000)}`,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)], // sorteando o indice aleantório para escolher um status
      entregadorId: `ENT-00${Math.floor(Math.random() * 3) + 1}`,
      timestamp: new Date() 
    });
  }),
  share() // share é um operador do RXJS que permite que múltiplos observadores compartilhem a mesma fonte de dados,
  // evitando múltiplas execuções do intervalo e do map para cada subscrição.
);