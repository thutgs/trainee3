import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class CapitalizePipe implements PipeTransform { // PipeTransform é uma interface que define o método transform, 
// que é chamado para transformar os dados de entrada antes de serem processados pelo controlador,
// sendo sempre necessário implementá-lo quando formos criar um pipe personalizado
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value.nome !== 'string') return value; // se o nome não for uma string, retorna o valor original sem alterações
    
    // vamos transformar "mouse gamer" em "Mouse gamer", por exemplo
    value.nome = value.nome.charAt(0).toUpperCase() + value.nome.slice(1).toLowerCase();
    return value;
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