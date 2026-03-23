# Tarefa 11: Censo Socioeconômico
### Angular Template Driven Forms

Este projeto foi desenvolvido focando na implementação de um formulário utilizando a abordagem **Template Driven** do Angular.

## 📋 Campos e Regras de Negócio

O formulário coleta as seguintes informações, garantindo a integridade dos dados através de validações:

| Campo | Tipo de Input | Validação |
| :--- | :--- | :--- |
| **Nome Completo** | Text | `required`, `minlength="3"` |
| **E-mail Pessoal** | Email | `required`, `email` |
| **CPF** | Text | `required`, `pattern` (Formato: 000.000.000-00) |
| **Data de Nascimento** | Date | `required` |
| **Telefone** | Tel | `required`, `pattern` (Formato: (00) 00000-0000) |
| **Gênero** | Select | `required` |
| **Estado Civil** | Select | `required` |
| **Renda Familiar** | Select | `required` (Categorias por faixas salariais) |
| **Escolaridade** | Select | `required` |
| **Cidade / Estado** | Text | `required` |

---

## ⚙️ Destaques da implementação

### 1. Sincronização das respostas do formulário com o objeto criado
Utilização do `[(ngModel)]` para garantir que o objeto `dadosCenso` no TypeScript reflita exatamente o que o usuário interage na interface em tempo real.

### 2. Validação instatânea dos campos
Os campos utilizam as classes nativas do Angular (`.ng-invalid` e `.ng-touched`) para fornecer feedback visual. As bordas dos campos tornam-se vermelhas apenas se o usuário interagir com o campo e deixá-lo inválido, evitando um formulário "poluído" logo no carregamento.

### 3. Submissão e Reset de Formulário
Ao clicar em "Finalizar e Enviar", o sistema:
1. Valida se o formulário completo está íntegro (`f.valid`).
2. Gera um log dos dados no console (usando `JSON.stringify` para evitar referências a objetos que já foram limpos).
3. Dispara o método `form.resetForm()`, que limpa os dados e remove os estados de erro do HTML.
4. Exibe um banner de sucesso temporário abaixo do botão de envio.

---

## 🚀 Como Executar

1. Instale as dependências:
   npm install

2. Inicie o servidor de desenvolvimento: 
     ng serve

3. Navegue para http://localhost:4200/.