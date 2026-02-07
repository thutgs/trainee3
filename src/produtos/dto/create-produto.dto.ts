// class-validator é uma biblioteca que permite validar objetos 
// ela garante que os dados recebidos em requisições HTTP estejam no formato correto antes de serem processados
import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateProdutoDto {
  @IsString() // garante que o dado enviado seja um texto
  @IsNotEmpty() // impede que o nome seja enviado como uma string vazia
  nome: string;

  @IsNumber() // garante que o preço seja um valor numérico
  @Min(0) // garante que o preço seja um número positivo (0 ou mais)
  preco: number;
}