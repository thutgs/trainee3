import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { CapitalizePipe, PriceRoundPipe } from '../common/pipes/pipe';

// o controller é responsável por receber as requisições HTTP, processar os dados de entrada (usando DTOs e Pipes)
//  e delegar as operações de negócio para o service, que por sua vez interage com o banco de dados usando o TypeORM.

// O prefixo 'produtos' define a rota base para este CRUD (ex: http://localhost:3000/produtos)
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @UsePipes(new ValidationPipe(), new CapitalizePipe(), new PriceRoundPipe()) // aplicando os pipes de validação e os criados
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    // O service utiliza o TypeORM para realizar o INSERT no PostgreSQL
    return await this.produtosService.create(createProdutoDto);
  }

  @Get()
  async findAll() {
    // Retorna a lista completa de produtos do banco de dados
    return await this.produtosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.produtosService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe(), new CapitalizePipe(), new PriceRoundPipe()) // aplicando os pipes de validação e os criados
  async update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    // Realiza a atualização parcial dos dados no banco
    return await this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Executa o comando DELETE após verificar a existência do produto
    return await this.produtosService.remove(id);
  }
}