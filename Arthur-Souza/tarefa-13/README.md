# Monitoramento de Estoque de Produtos

Sistema Full-Stack de Gestão (CRUD) para controle de estoque e preços de produtos.

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* Angular (Standalone Components, Reactive Forms, Router, Signals)
* Bootstrap / SCSS
* RxJS (Programação Reativa)

**Back-end:**
* Node.js com NestJS (API RESTful)
* TypeORM
* PostgreSQL


## ⚙️ Funcionalidades Implementadas

* **Create (Criação):** Cadastro de produtos com validação em tempo real. O sistema barra informações incorretas antes mesmo de tentar enviá-las ao servidor.
* **Read (Leitura & Busca):** Listagem dinâmica com uma **barra de pesquisa instantânea**, que filtra os dados na tela em milissegundos sem precisar recarregar a página.
* **Update (Atualização):** Tela de edição inteligente que reaproveita a estrutura de cadastro e preenche automaticamente os dados do produto selecionado.
* **Delete (Exclusão):** Remoção de registros de forma segura, com atualização da tabela em tempo real após a confirmação.

---

## 🗄️ Estrutura de Dados (PostgreSQL)

A entidade `Produto` foi modelada com os seguintes atributos:

* `id` (UUID, Chave Primária)
* `nome` (Texto, Obrigatório)
* `categoria` (Categoria predefinida, Obrigatória)
* `qtd_estoque` (Número Inteiro, Maior ou igual a zero)
* `preco` (Número Decimal, Maior que zero)
* `createdAt` / `updatedAt` (Registro automático de datas)

---


## 🚀 Como executar o projeto

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* Banco de dados [PostgreSQL](https://www.postgresql.org/) rodando localmente.

### 1. Configurando o Back-end (NestJS)
Abra o terminal na pasta do back-end e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as suas credenciais do PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```

Em seguida, inicie o servidor da API:

```bash
npm run start:dev
```
*(A API estará rodando em `http://localhost:3000`)*

### 2. Configurando o Front-end (Angular)
Abra um novo terminal na pasta do front-end e instale as dependências:

```bash
cd frontend
npm install
```

Inicie a aplicação:

```bash
ng serve
```
*(A interface estará disponível no navegador em `http://localhost:4200`)*

---

## 📌 Arquitetura e Decisões Técnicas

* **Rotas (Navegação e Endpoints):** No Front-end, o *Angular Router* foi utilizado para criar uma Single Page Application (SPA), permitindo transições rápidas entre a tabela e o formulário sem recarregar o navegador. No Back-end, os *Controllers* do NestJS expõem rotas RESTful claras e semânticas.

* **Observables (Comunicação Assíncrona):** O tráfego de dados entre o Front e o Back-end é gerenciado via RxJS. O uso de *Observables* permite que a interface "escute" as respostas do servidor sem travar a tela do usuário enquanto aguarda.

* **Performance com Angular Signals:** A barra de pesquisa e a atualização da tabela utilizam a reatividade do Angular (Signals). Isso garante que apenas a parte da tela que sofreu alteração seja redesenhada, economizando muito processamento no navegador.

* **Experiência do Usuário (UX) e Validação:** Formulários reativos foram usados para dar feedback visual imediato. Se o usuário esquecer um campo obrigatório, a tela avisa na hora, poupando o servidor de receber requisições incorretas.

* **Integridade de Tipagem entre Camadas:** Devido ao comportamento padrão do driver do PostgreSQL de retornar colunas do tipo `decimal` como `string` (para prevenir perda de precisão flutuante), foi implementada uma camada de tratamento no Front-end. Os dados numéricos sofrem *casting* explícito (conversão) antes do envio, garantindo que o contrato de dados seja respeitado e evitando que o `ValidationPipe` (DTOs) do NestJS rejeite a requisição com Erro 400 (Bad Request).

* **Segurança de Credenciais:** As senhas e dados sensíveis de conexão com o banco não ficam expostos no código-fonte, sendo gerenciados com segurança através de variáveis de ambiente (`.env`).