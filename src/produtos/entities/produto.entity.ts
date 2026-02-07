// TypeORM é um ORM (Object-Relational Mapping) que facilita a interação com bancos de dados relacionais. 
// Ele permite definir entidades como classes, que são mapeadas para tabelas no banco de dados. 
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @Entity sinaliza que esta classe representa uma tabela no banco de dados SQLite
@Entity()
export class Produto {
  
  // @PrimaryGeneratedColumn indica que a coluna 'id' é uma chave primária auto-incrementada (1, 2, 3, ...)
  @PrimaryGeneratedColumn()
  id!: number; // usamos '!' para informa ao TypeScript que o banco de dados garantirá que essa propriedade não será nula

  // @Column indica que 'nome' e 'preco' são colunas na tabela do banco de dados
  @Column()
  nome!: string;

  @Column()
  preco!: number;
}