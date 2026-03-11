import { timer, map, switchMap, of, repeat } from 'rxjs';

export const alertas$ = of(null).pipe(
  // switchMap é um operador que cancela o Observable anterior e inicia um novo Observable,
  // e nesse caso reinicia o fluxo com um novo tempo aleatório toda vez
  switchMap(() => {
    const tempoAleatorio = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000; // Entre 3s e 8s 
    return timer(tempoAleatorio); // timer é um operador que emite um valor após um período de tempo especificado
  }),
  map(() => { // map nesse caso é usado para transformar o valor emitido pelo timer em um objeto de alerta
    const tipos = ['atraso', 'veiculo_parado', 'rota_desviada']; 
    const severidades = ['baixa', 'media', 'alta'];
    
    return {
      tipo: tipos[Math.floor(Math.random() * tipos.length)], 
      entregadorId: `ENT-00${Math.floor(Math.random() * 3) + 1}`,
      mensagem: "Alerta de sistema gerado automaticamente", 
      severidade: severidades[Math.floor(Math.random() * severidades.length)]
    };
  }),
  repeat() // repeat é um operador que repete a sequência de emissão do Observable, garantindo que o processo de geração de alertas continue indefinidamente
);