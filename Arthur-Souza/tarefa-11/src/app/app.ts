import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para ngIf
import { FormsModule } from '@angular/forms'; // Habilita o Template Driven

// @Component é o decorador que define a classe como um componente Angular, nesse caso standalone
@Component({
  selector: 'app-root', // O seletor é a tag HTML que representa este componente
  standalone: true, // Indica que este componente é independente, sem necessidade de ser declarado em um módulo
  imports: [CommonModule, FormsModule], // Adicione os dois aqui
  templateUrl: './app.html', // O caminho para o arquivo HTML do componente
  styleUrl: './app.css' // O caminho para o arquivo CSS do componente
})
export class AppComponent {
  enviado = false; // Controle da mensagem de sucesso

  // Objeto que vai receber os dados do formulário (Template Driven)
  dadosCenso = {
    nomeCompleto: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    genero: '',
    estadoCivil: '',
    rendaMensal: '',
    escolaridade: '',
    cidadeEstado: ''
  };

  // Método chamado quando o formulário é submetido
  onSubmit(form: any) {// form: any pois o tipo NgForm não é importado diretamente, mas é passado pelo template
    if (form.valid) {
      // aqui tive que usar JSON.parse(JSON.stringify()) para criar uma cópia profunda do objeto, 
      // evitando referências e garantindo que os dados sejam exibidos corretamente no console, pois estavam sendo exibidos como objetos vazios 
      // devido ao uso do resetForm() que limpa o objeto original antes da exibição.
      console.log('Formulário enviado com sucesso!', JSON.parse(JSON.stringify(this.dadosCenso)));
  
      this.enviado = true; // Mostra a mensagem de sucesso

      form.resetForm(); // Limpa o formulário

      setTimeout(() => this.enviado = false, 5000); // Esconde a mensagem de sucesso após 5 segundos
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }
}