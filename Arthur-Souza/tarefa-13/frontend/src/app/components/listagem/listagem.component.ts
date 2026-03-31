import { Component, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.models';

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss',
})
export class ListagemComponent implements OnInit {
  
  // criando um Signal que vai armazenar a lista de produtos que vem do backend, usando a interface Produto para tipar o array
  produtos = signal<Produto[]>([]);

  // criando um Signal para armazenar o termo de busca digitado na barra de pesquisa
  termoBusca = signal<string>(''); 

  // 
  produtosFiltrados = computed(() => { // computed é usado pois ele recalcula a lista filtrada automaticamente toda vez que o termo de busca ou a lista de produtos original for atualizada
    const termo = this.termoBusca().toLowerCase();
    const listaOriginal = this.produtos();

    if (!termo) {
      return listaOriginal; // Se a barra estiver vazia, devolve a listagem original, sem filtros
    }

    return listaOriginal.filter(produto => 
      produto.nome.toLowerCase().includes(termo) // aqui, retorna apenas os produtos cujo nome inclui o termo de busca, ignorando maiúsculas e minúsculas
    );
  });

  // injetando o serviço de produto para poder usar os métodos de comunicação com o backend
  constructor(private produtoService: ProdutoService) {}

  // deve ser executado assim que o componente for criado
  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({ // inscrição no observable que busca a lista de produtos do backend
      next: (dados) => {
        // Aqui atualiza-se o valor do Signal, e assim o angular atualiza a tela ao detectar essa mudança
        this.produtos.set(dados);
      },
      error: (erro) => {
        console.error('Erro ao buscar a lista de produtos:', erro);
      }
    });
  }


  // Função disparada pela barra de pesquisa no HTML
  filtrarProdutos(event: Event): void {
    // Aqui, se obtém o valor digitado na barra de pesquisa e atualiza o Signal termoBusca,
    // que por sua vez, atualiza a lista filtrada exibida na tela
    const valorDigitado = (event.target as HTMLInputElement).value;
    this.termoBusca.set(valorDigitado); 
  }


  // Fluxo de Exclusão de um Produto
  excluir(id: string): void {
    if (confirm('Tem certeza que deseja excluir este produto do banco de dados?')) {// inserindo uma confirmação da exclusão
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          this.carregarProdutos(); // após a exclusão, recarrega-se a tabela para atualizar a view
        },
        error: (erro) => console.error('Erro ao tentar realizar a exclusão:', erro)
      });
    }
  }
}
