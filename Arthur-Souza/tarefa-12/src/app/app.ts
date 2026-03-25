import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TesteRecordComponent } from './app_form_record'; // Importando o componente de teste do FormRecord para usar no template

// a principal diferença do Reactive Forms é que aqui o formulário é controlado pelo componente, e não pelo template (html).
// Isso nos dá mais controle e flexibilidade, especialmente para formulários mais complexos.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TesteRecordComponent], // importando o ReactiveFormsModule para usar os formulários reativos 
  // e o TesteRecordComponent para mostrar o exemplo do FormRecord no template.
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class AppComponent implements OnInit {
  // Criando o formulário
  formCenso!: FormGroup;
  enviado = false;

  // Injetamos o FormBuilder para facilitar a criação dos campos, ele é uma classe de conveniência que 
  // ajuda a criar FormGroups, FormControls e FormArrays de forma mais simples, sem precisar instanciá-los em cada campo manualmente.
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.adicionarIdioma(); // Adiciona um campo de idioma vazio ao iniciar o formulário, para que o usuário já tenha um campo para preencher.
  }

  inicializarFormulario() {
    this.formCenso = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/\d{3}\.\d{3}\.\d{3}-\d{2}/)]],
      dataNascimento: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/\(\d{2}\) \d{5}-\d{4}/)]],
      genero: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      rendaMensal: ['', Validators.required],
      escolaridade: ['', Validators.required],
      localidade: ['', Validators.required],
      idiomas: this.fb.array([]) // campo multivalorado (FormArray) para poder adicionar múltiplos idiomas
    });
  }

  // Aqui criamos um getter para facilitar o acesso ao FormArray de idiomas, assim é possível manipular os idiomas
  //  de forma mais simples no template e no código.

  get idiomas() {
    return this.formCenso.get('idiomas') as FormArray;
  }

  // Aqui criamos métodos para adicionar e remover idiomas do FormArray, permitindo que o usuário adicione quantos idiomas quiser.

  // O método adicionarIdioma adiciona um novo FormControl vazio ao FormArray de idiomas
  adicionarIdioma() {
    this.idiomas.push(this.fb.control('', Validators.required));
  }

  // O método removerIdioma remove o FormControl do índice especificado.
 removerIdioma(index: number) {
  if (this.idiomas.length > 1) { // usando ese if para garantir que sempre haja pelo menos um campo de idioma no formulário,
  //  evitando que o usuário remova todos os campos e deixe o FormArray vazio, o que poderia causar problemas de validação.
    this.idiomas.removeAt(index);
  }
}

  onSubmit() {
    if (this.formCenso.valid) {
      console.log('Dados Enviados (Reactive):', this.formCenso.value);
      this.enviado = true;
      
      // No Reactive, o reset é feito por um método do próprio FormGroup, que limpa os valores e o estado de validação do formulário.
      this.formCenso.reset();
      
      // Aqui é necessário limpar o FormArray de idiomas manualmente, pois o reset não remove os controles do array, apenas limpa seus valores.
      this.idiomas.clear();

      // Após limpar o FormArray, podemos adicionar um campo de idioma vazio novamente para que o usuário tenha um campo para preencher.
      this.adicionarIdioma();

      setTimeout(() => this.enviado = false, 5000);
    }
  }
}