import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CategoriaProduto } from '../../models/produto.models'; // importando o enum de categorias para usar no formulário

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // importando o reactive forms para implementar o formulário
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {
  
  produtoForm!: FormGroup; // criando o formulário
  id_Edicao: string | null = null; // criando a variável que vai armazenar o ID do produto que será editado
  
  // aqui transforma-se o Enum em um array para poder ser utilizado no HTML
  categorias = Object.values(CategoriaProduto);

  constructor(
    private fb: FormBuilder, // FormBuilder é a classe do Angular que facilita a construção de formulários reativos,
    //  sem precisar ficar escrevendo new FormGroup() e new FormControl() para cada campo.
    private produtoService: ProdutoService, // Importamos o serviço para fazer as requisições de criação e edição
    private router: Router, // Importamos o Router para navegar de volta para a listagem após salvar
    private route: ActivatedRoute // Serve para lermos a URL e descobrirmos se tem um ID ali
  ) {}

  // formando o formulário assim que o componente for inicializado, usando o FormBuilder para criar os campos e as validações
  ngOnInit(): void { // aqui usei void porque a função ngOnInit não retorna nada, ela apenas executa um código quando o componente é inicializado.
  //  O tipo void é utilizado para indicar que a função não tem um valor de retorno.
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      qtd_estoque: [0, [Validators.required, Validators.min(0)]],
      preco: [0, [Validators.required, Validators.min(0.01)]]
    });

    // aqui utiliza-se a propriedade snapshot do ActivatedRoute para ler o parâmetro 'id' da URL.
    this.id_Edicao = this.route.snapshot.paramMap.get('id');


     // Se  esse parâmetro existir, significa que estamos editando um produto existente, e então faz uma requisição para buscar
    //  os dados desse produto e preencher o formulário usando patchValue. 
    if (this.id_Edicao) {
      // Se for uma edição, buscamos os dados no NestJS e preenche-se os dados automaticamente no formulário usando patchValue
      this.produtoService.getProduto(this.id_Edicao).subscribe({
        next: (produto) => this.produtoForm.patchValue(produto), // o patchValue "prenche" o formulário com os dados do produto que veio da API, associando os campos pelo nome
        error: (err) => console.error('Erro ao buscar produto para edição', err)
      });
    }
  }

  // Função disparada quando clicamos em "Salvar"
  salvar(): void {
    if (this.produtoForm.invalid) {
      // se o usuário tentar salvar sem preencher todos os campos, essa linha vai marcar todos os campos como "tocados", 
      // e fazer com que as mensagens de erro apareçam para todos eles
      this.produtoForm.markAllAsTouched(); 
      return;
    }

    // extraindo os dados do formulário
    const dadosDoFormulario = this.produtoForm.value;

    // forçando a conversão de preço e quantidade para número, pois o formulário estava retornando tudo como string
    dadosDoFormulario.preco = Number(dadosDoFormulario.preco);
    dadosDoFormulario.qtd_estoque = Number(dadosDoFormulario.qtd_estoque);


    // Fluxo de Edição 
    if (this.id_Edicao) {
      this.produtoService.updateProduto(this.id_Edicao, dadosDoFormulario).subscribe({
        next: () => this.router.navigate(['/']), // Volta para a listagem
        error: (err) => console.error('Erro ao editar', err)
      });
    } else {
      // Fluxo de Criação
      this.produtoService.createProduto(dadosDoFormulario).subscribe({
        next: () => this.router.navigate(['/']), // Volta para a listagem
        error: (err) => console.error('Erro ao criar', err)
      });
    }
  }
}
