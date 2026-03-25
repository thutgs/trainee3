import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormRecord, FormControl, Validators } from '@angular/forms';

// O FormRecord  é útil para criar formulários dinâmicos e flexíveis, permitindo que os desenvolvedores definam a estrutura 
// do formulário de forma programática, sem a necessidade de criar classes ou interfaces específicas para cada tipo de formulário.

// No FormRecord, todos os campos precisam ser do mesmo tipo, o que é ideal para casos
// como configurações de privacidade, onde cada campo representa uma permissão ou configuração específica.

@Component({
  selector: 'app-teste-record',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container" [formGroup]="configPrivacidade">
      <h3>Teste FormRecord</h3>
      <p>Defina suas preferências:</p>
      
      @for (item of itensPrivacidade; track item) {
        <div class="form-group-row">
          <label>{{ labelsPrivacidade[item]}}</label>
          <input type="checkbox" [formControlName]="item">
        </div>
      }
      
      <pre>{{ configPrivacidade.value | json }}</pre>
    </div>
  `
})

// A principal vantagem é que, se decidirmos adicionar ou remover campos, não precisamos criar uma nova classe ou interface, 
// basta atualizar o FormRecord diretamente, tornando-o mais flexível e fácil de manter.

export class TesteRecordComponent {
  // O FormRecord garante que todos os controles sejam do tipo boolean
  configPrivacidade = new FormRecord<FormControl<boolean>>({
    newsletterMensal: new FormControl(false, { nonNullable: true }),
    eventosIntegracao: new FormControl(false, { nonNullable: true }),
    treinamentosInternos: new FormControl(false, { nonNullable: true })
  });

  // Mapeamento de chaves para labels amigáveis
  labelsPrivacidade: Record<string, string> = {
    newsletterMensal: 'Desejo receber o informativo mensal por e-mail.',
    eventosIntegracao: 'Tenho interesse em participar de happy hours e eventos de time.',
    treinamentosInternos: 'Gostaria de ser avisado sobre novos cursos de capacitação.'
  };

  // Chaves dinâmicas para o loop no HTML
  get itensPrivacidade() {
    return Object.keys(this.configPrivacidade.controls);
  }
}