// class-validator é uma biblioteca que permite validar objetos 
// ela garante que os dados recebidos em requisições HTTP estejam no formato correto antes de serem processados
import { IsString, IsNumber, IsNotEmpty, MaxLength, IsPositive } from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' }) // impede que o nome seja enviado como uma string vazia
  @IsString({ message: 'O nome deve ser um texto' }) // garante que o dado enviado seja um texto
  @MaxLength(100, { message: 'Nome muito longo' }) // limita o tamanho do nome a 100 caracteres
  nome: string;

  @IsNumber({}, { message: 'O preço deve ser um número' }) // garante que o preço seja um valor numérico
  @IsPositive({ message: 'O preço deve ser maior que zero' }) // garante que o preço seja um número positivo (0 ou mais)
  preco: number;
}