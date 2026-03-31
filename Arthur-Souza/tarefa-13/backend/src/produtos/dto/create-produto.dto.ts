// class-validator é uma biblioteca que permite validar objetos 
// ela garante que os dados recebidos em requisições HTTP estejam no formato correto antes de serem processados
import { IsString, IsNumber, Min, IsNotEmpty, IsEnum, IsInt, MaxLength, IsPositive} from 'class-validator';
import { CategoriaProduto } from '../entities/produto.entity';

// dto (Data Transfer Object) é um padrão de design usado para transferir dados entre camadas de uma aplicação

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio' }) // impede que o nome seja enviado como uma string vazia
  @IsString({ message: 'O nome deve ser um texto válido' }) // garante que o dado enviado seja um texto
  @MaxLength(50, { message: 'Nome muito longo' }) // limita o tamanho do nome a 50 caracteres
  nome: string;

  @IsNumber({}, { message: 'O preço deve ser um número' }) // garante que o preço seja um valor numérico
  @IsPositive({ message: 'O preço deve ser maior que zero' }) // garante que o preço seja um número positivo (0 ou mais)
  @IsNotEmpty({ message: 'O preço não pode estar vazio' })
  preco: number;

  @IsEnum(CategoriaProduto, { message: 'Categoria inválida. Escolha uma das opções predefinidas.' })
  @IsNotEmpty({ message: 'A categoria não pode estar vazia' })
  categoria: CategoriaProduto;

  @IsInt({ message: 'A quantidade em estoque deve ser um número inteiro' })
  @Min(0, { message: 'O estoque deve ser maior ou igual a zero' })
  @IsNotEmpty({ message: 'A quantidade em estoque não pode estar vazia' })
  qtd_estoque: number;


}