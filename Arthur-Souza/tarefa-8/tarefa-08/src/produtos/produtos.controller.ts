import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

//  O uso do async/await garante que o fluxo de execução seja não-bloqueante, permitindo que o servidor continue
//  respondendo a outras requisições enquanto aguarda as operações do banco de dados serem concluídas.


// Aqui o try/catch é usado para capturar erros que podem ocorrer durante a execução dos métodos do service, 
// impedindo que hajam apenas erros genéricos (500).


@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    try {
      // O await espera o Service processar a Promise, sem bloquear o event loop
      return await this.produtosService.create(createProdutoDto);
    } catch (error) {
      throw error; // repassa o erro para o usuário
    }
  }

  @Get()
  async findAll() {
    try { // O await espera o Service processar a Promise, sem bloquear o event loop
      return await this.produtosService.findAll();
    } catch (error) {
      throw error; // repassa o erro para o usuário
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // O fluxo trava aqui de forma não-bloqueante até o SQLite encontrar o produto ou retornar um erro
      return await this.produtosService.findOne(+id);
    } catch (error) {
      throw error; // repassa o erro para o usuário, seja ele de produto não encontrado ou erro técnico do banco
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    try { // O await espera o Service processar a Promise, sem bloquear o event loop
      return await this.produtosService.update(+id, updateProdutoDto);
    } catch (error) {
      throw error; // repassa o erro para o usuário, seja ele de produto não encontrado, erro de validação ou erro técnico do banco
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try { // O await espera o Service processar a Promise, sem bloquear o event loop
      return await this.produtosService.remove(+id);
    } catch (error) {
      throw error; // repassa o erro para o usuário, seja ele de produto não encontrado ou erro técnico do banco
    }
  }
}
