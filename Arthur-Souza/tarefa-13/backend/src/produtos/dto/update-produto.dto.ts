import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';

// PartialType é uma função que atualiza um recurso, mas tornando todas as suas propriedades opcionais
export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {} 
// Aqui extends está instanciando o PartialType, que por sua vez recebe o CreateProdutoDto como argumento, ou seja,
//  o UpdateProdutoDto é uma versão do CreateProdutoDto onde todas as propriedades são opcionais,
//  permitindo atualizações parciais dos dados do produto.
