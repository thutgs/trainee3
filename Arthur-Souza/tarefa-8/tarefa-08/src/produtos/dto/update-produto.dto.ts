import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';

// PartialType é uma função que atualiza um recurso, mas tornando todas as suas propriedades opcionais
export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {}
