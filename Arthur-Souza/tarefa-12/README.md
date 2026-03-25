# 📊 Tarefa 12: Censo Socioecômico com Reactive Forms

Este projeto representa a evolução técnica de formulários, migrando da abordagem *Template Driven* para **Reactive Forms**. O objetivo é garantir maior controle programático, controlando o formulário majoritariamente pelo componente, além de permitir validações mais robustas e manipulação dinâmica de campos.

---

## 🚀 Tecnologias e Conceitos Implementados

* **Reactive Forms**: Gerenciamento do estado do formulário centralizado no componente TypeScript.
* **FormBuilder**: Utilização de serviço de conveniência para criação de estruturas complexas de forma limpa.
* **FormArray (Campos Multivalorados)**: Implementação dinâmica da seção de idiomas, permitindo a adição e remoção de campos conforme a necessidade do usuário.
* **FormRecord (Dicionário Dinâmico)**: Caso de teste focado em preferências do usuário, utilizando chaves dinâmicas com tipagem homogênea.
* **Standalone Components**: Arquitetura sem dependência de módulos globais.

---

## 🛠️ Estrutura do Formulário Principal (Censo)

O formulário principal foi refatorado para utilizar `FormGroup`, garantindo que cada campo possua validações síncronas específicas:

| Campo | Validação | Estrutura |
| :--- | :--- | :--- |
| **Identificação** | Nome (min 3), E-mail, CPF (Pattern), Telefone | `FormControl` |
| **Demográfico** | Gênero, Estado Civil, Renda, Escolaridade | `FormControl` |
| **Idiomas** | Obrigatório (min 1 campo) | `FormArray` |

### Diferencial: Lógica de Negócio no FormArray
O sistema foi configurado para que o Censo sempre inicie com um campo de idioma visível. A lógica de exclusão possui uma "trava" que impede a remoção do primeiro índice, garantindo a integridade dos dados mínimos coletados.

---

## 🧪 Teste FormRecord

Com o objetivo de realizar um teste da ferramenta do FormRecord, foi desenvolvido o componente `TesteRecordComponent`. Esta estrutura é ideal para cenários onde as chaves são dinâmicas (por exemplo advindas de um banco de dados), mas os valores compartilham o mesmo tipo.

**Exemplo aplicado: Preferências do usuário**
* **Chaves**: `newsletterMensal`, `eventosIntegracao`, `treinamentosInternos`.
* **Valor**: `FormControl<boolean>`.
* **Vantagem**: Facilidade de iteração usando `Object.keys()` no template e garantia de tipagem estrita no TypeScript.


---

## ⚙️ Como Executar o Projeto

1.  Certifique-se de ter o [Angular CLI](https://angular.io/cli) instalado.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    ng serve
    ```
4.  Acesse `http://localhost:4200/` para visualizar o Censo e o Teste de Record integrados.

---