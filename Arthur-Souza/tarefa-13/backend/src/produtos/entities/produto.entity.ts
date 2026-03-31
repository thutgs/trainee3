// TypeORM é um ORM (Object-Relational Mapping) que facilita a interação com bancos de dados relacionais. 
// Ele permite definir entidades como classes, que são mapeadas para tabelas no banco de dados. 
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Criando um enum das categorias de produtos  
// enum é um tipo de dado que permite definir um conjunto de valores pré-definidos
export enum CategoriaProduto {

  ELETRONICOS = 'Eletrônicos',
  PAPELARIA = 'Papelaria',
  MOVEIS = 'Móveis',
  OUTROS = 'Outros'
}

// @Entity sinaliza que esta classe representa uma tabela no banco de dados
@Entity()
export class Produto {
  
  // @PrimaryGeneratedColumn indica que a coluna 'id' é a chave primária e será gerada automaticamente pelo banco de dados.
  @PrimaryGeneratedColumn('uuid')
  id!: string; // no nest utilizamos '!' para informar ao TypeScript que o banco de dados garantirá que essa propriedade não será nula

  // @Column indica que é uma coluna na tabela do banco de dados
  @Column()
  nome!: string;

  @Column({type: 'decimal'}) // coloquei o tipo decimal para permitir armazenar os centavos
  preco!: number;

  @Column({ type: 'enum', enum: CategoriaProduto }) // defini a coluna 'categoria' como um enum, limitando os valores possíveis às categorias definidas
  categoria!: CategoriaProduto;

  @Column()
  qtd_estoque!: number;

  @CreateDateColumn() // Gerenciado automaticamente pelo TypeORM
  createdAt: Date;

  @UpdateDateColumn() // Gerenciado automaticamente pelo TypeORM
  updatedAt: Date;
}