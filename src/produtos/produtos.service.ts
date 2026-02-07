import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';

// Injectable permite que essa classe seja injetada em outras partes da aplicação
@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto) // injeta as ferramentas de banco de dados específicas para a entidade Produto
    private readonly repository: Repository<Produto>, // injetando o banco aqui
  ) {}

  // Cria um novo registro no banco
  create(dto: CreateProdutoDto) {
    const produto = this.repository.create(dto);
    return this.repository.save(produto); // .save() efetivamente executa o comando SQL 'INSERT' no SQLite
  } // aqui os tratamentos de erro são originados das validações do dto, no create-produto.dto.ts

  // Retorna todos os produtos cadastrados
  findAll() {
    return this.repository.find(); // .find() é um comando do TypeORM que gera automaticamente: SELECT * FROM produtos
  }

  // Busca um produto específico pelo ID
  async findOne(id: number) {
    const produto = await this.repository.findOneBy({ id });

    // Se o banco retornar vazio, lançamos uma exceção tratada pelo NestJS, que retorna um erro 404
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  // Atualiza os dados de um produto existente
  async update(id: number, dto: UpdateProdutoDto) {
    const produto = await this.findOne(id);
    this.repository.merge(produto, dto); // .merge() combina os dados novos (dto) com o objeto existente (produto)
    return this.repository.save(produto);
  } // aqui os tratamentos de erro são originados das validações do dto, no update-produto.dto.ts

  async remove(id: number) {
    const produto = await this.findOne(id);
    return this.repository.remove(produto); // Executa o comando SQL 'DELETE'
  } // aqui o tratamento de erro é originado do findOne, que verifica se o produto existe antes de tentar deletar
}