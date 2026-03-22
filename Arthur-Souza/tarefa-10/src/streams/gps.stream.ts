import { interval, map, share } from 'rxjs';

// interval é um operador do RxJS que emite números sequenciais a cada intervalo de tempo especificado.
export const gps$ = interval(1000).pipe( // pipe é um método do RxJS que permite encadear operadores para transformar os dados emitidos por um Observable
  map(() => ({
    // math.random() gera um número aleatório entre 0 e 1 e math.floor() arredonda para baixo, garantindo que o número seja um inteiro.
    entregadorId: `ENT-00${Math.floor(Math.random() * 3) + 1}`, // Simula ENT-001 a ENT-003
    lat: (Math.random() * 180 - 90), // Latitude simulada 
    lng: (Math.random() * 360 - 180), // Longitude simulada
    velocidade: Math.floor(Math.random() * 81), // 0 a 80 km/h
    timestamp: new Date() // registra o horário da leitura do GPS
  })),
  share() // share é um operador do RXJS que permite que múltiplos observadores compartilhem a mesma fonte de dados,
  //  evitando múltiplas execuções do intervalo e do map para cada subscrição.
);