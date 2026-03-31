import { PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';


@Injectable()
export class CapitalizePipe implements PipeTransform { // PipeTransform é uma interface que define o método transform, 
// que é chamado para transformar os dados de entrada antes de serem processados pelo controlador,
// sendo sempre necessário implementá-lo quando formos criar um pipe personalizado
  transform(value: any, metadata: ArgumentMetadata) {
    // verifica se o valor existe e se o nome é uma string
    if (value && typeof value.nome === 'string') {
      
      // limpa possíveis espaços a mais no início, meio e fim da string
      const nomeLimpo = value.nome.replace(/\s+/g, ' ').trim();
      
      // formata que todas as palavras inseridas tenham a primeira letra maiúscula e o resto minúscula
      value.nome = nomeLimpo
        .split(' ') // divide a frase em um array das palavras
        .map(palavra => {
          // nessa linha aplica-se a regra
          return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        })
        .join(' '); // junta-se novamente o array de palavras em uma única string separada por espaços
    }
    
    return value; // se o nome não for uma string, retorna apenas o valor original sem alterações
  }
}

@Injectable()
export class PriceRoundPipe implements PipeTransform {
  transform(value: any) { 
    if (value && typeof value.preco === 'number') {
      value.preco = Math.round(value.preco * 100) / 100; // arredonda o preço para 2 casas decimais
    }
    return value;
  }
}