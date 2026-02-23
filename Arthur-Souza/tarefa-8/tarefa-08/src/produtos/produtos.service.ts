import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

// Aqui utilizam-se as promises para facilitar o tratamento de objetos que não necessariamente são
// conhecidos no momento da escrita do código.

// O async ainda é utilizado para garantir que o método retorne uma Promise, 
// o que é essencial para a integração com o controller 

@Injectable()
export class ProdutosService implements OnModuleInit {
  private db: sqlite3.Database;

  // executar assim que o módulo inicia, responsável por criar a conexão com o banco e criar a tabela caso ela não exista
  onModuleInit() {
    // conecta ao banco SQLite 
    this.db = new sqlite3.Database('./database.sqlite', (err) => {
      if (!err) {
        // criando a tabela "produtos" usando SQL puro
        this.db.run(`
          CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            preco REAL)
        `);
      }
    });
  }

 // Cria um novo registro no banco
 async create(dto: CreateProdutoDto): Promise<any> { // Adicionado async e definindo o tipo de retorno como any
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO produtos (nome, preco) VALUES (?, ?)`;
      this.db.run(query, [dto.nome, dto.preco], function(err) {
        if (err) {
        if (err.message.includes('UNIQUE')) {
          reject(new BadRequestException('Este produto já existe')); // tratamento de erro com SQL 
        }
        reject(new BadRequestException('Erro ao inserir produto')); // tratamento de erro com SQL
      } else {
        resolve({ id: this.lastID, ...dto });
      }
    });
  });
} // os demais tratamentos de erro são originados das validações do dto, no create-produto.dto.ts

  // Retorna todos os produtos cadastrados
  async findAll(): Promise<any[]> { // Adicionado async e definindo o tipo de retorno como any[]
   return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM produtos', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Busca um produto específico pelo ID
  async findOne(id: number): Promise<any> { // Adicionado async e definindo o tipo de retorno como any
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
        if (err) {
      // Erro técnico de sintaxe ou conexão
      reject(new BadRequestException('Erro na consulta ao banco de dados'));
    } else if (!row) {
      // Caso o ID não exista no banco
      reject(new NotFoundException(`Produto com ID ${id} não encontrado`));
    } else {
      resolve(row);
    }
  });
});
} 
  // Atualiza os dados de um produto existente
 async update(id: number, dto: UpdateProdutoDto): Promise<any> { // Adicionado async e definindo o tipo de retorno como any
  return new Promise((resolve, reject) => {
    const campos = Object.keys(dto);
    const valores = Object.values(dto);
    
    const setClause = campos.map((campo) => `${campo} = ?`).join(', ');
    const query = `UPDATE produtos SET ${setClause} WHERE id = ?`;

    this.db.run(query, [...valores, id], function (err) {
      if (err) {
          reject(new BadRequestException('Erro ao atualizar o produto')); // tratamento de erro com SQL
        } else if (this.changes === 0) {
          reject(new NotFoundException(`Produto com ID ${id} não encontrado`)); // tratamento de erro caso o ID não exista no banco
        } else {
          resolve({ id, ...dto });
        }
      });
    });
  } //  os demais tratamentos de erro são originados das validações do dto, no update-produto.dto.ts

  // Remove um produto do banco de dados
  async remove(id: number): Promise<any> { // Adicionado async e definindo o tipo de retorno como any
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM produtos WHERE id = ?', [id], function(err) {
        if (err) {
          reject(new BadRequestException('Erro ao excluir produto no banco')); // tratamento de erro com SQL
        } else if (this.changes === 0) {
          reject(new NotFoundException(`Produto com ID ${id} não encontrado`)); // tratamento de erro caso o ID não exista no banco
        } else {
          resolve({ deleted: true });
        }
      });
    });
  }
}
