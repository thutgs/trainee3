import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.models'; // Importando a nossa interface e o Enum

// esse arquivo é o serviço de produto, onde ficam os métodos que fazem a comunicação com o backend,
//  utilizando o HttpClient para realizar as requisições HTTP

@Injectable({
  providedIn: 'root', // aqui o 'root' indica que o serviço estará disponível em toda a aplicação, existindo apenas uma instância dele (singleton)
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos'; // URL do backend que será consumida

  constructor(private http: HttpClient) {} // injetando o HttpClient para realizar as requisições HTTP

  // métodos para consumir a API do backend

  // nos métodos, foram utilizados observables pois eles lidarão com operações assíncronas (requisições HTTP)

  // listar todos os produtos (get)
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  // listar um produto específico pelo ID (get)
  getProduto(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  // criar um novo produto (post)
  createProduto(produto: Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>): Observable<Produto> {
    // aqui o omit é utilizado para criar um tipo que tem todas as propriedades de Produto, exceto 'id', 'createdAt' e 'updatedAt',
    // pois essas propriedades são geradas automaticamente pelo backend e não devem ser enviadas na requisição de criação
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  // atualizar um produto (patch)
  updateProduto(id: string, produto: Partial<Produto>): Observable<Produto> {
    return this.http.patch<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  // deletar um produto (delete)
  deleteProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
