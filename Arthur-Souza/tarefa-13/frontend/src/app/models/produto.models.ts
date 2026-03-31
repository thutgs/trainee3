// criando a interface do produto, para informar o formato de dados esperado do backend

export enum CategoriaProduto {
  ELETRONICOS = 'Eletrônicos',
  PAPELARIA = 'Papelaria',
  MOVEIS = 'Móveis',
  OUTROS = 'Outros'
}

export interface Produto {
  id?: string; // usando ? aqui pois o id é gerado automaticamente pelo banco, então ele pode não estar presente quando cria-se um novo produto
  nome: string;
  preco: number;
  categoria: CategoriaProduto; // já inserindo o enum aqui, para evitar que o erro de validação apareça apenas no backend
  qtd_estoque: number;
  createdAt?: string;
  updatedAt?: string;
}