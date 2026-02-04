import express, { Request, Response } from 'express'; // Importando o express usando import em vez de require

const app = express(); 
const port = 3000; // Porta do localhost

app.use(express.json()); // configurando para utilizar JSON  

// criando a interface do produto
interface Produto {
    id: number;
    nome: string;
    preco: number;
}

// BANCO DE DADOS EM MEMÓRIA
// a principal diferença é que agora estamos usando delimitamos que é um array de 'Produto'
let produtos: Produto[] = [
    { id: 1, nome: "Notebook", preco: 2500 },
    { id: 2, nome: "Mouse", preco: 50 },
    { id: 3, nome: "Teclado", preco: 150 },
    { id: 4, nome: "Monitor", preco: 800 }
];

// --- ROTAS ---

// Rota inicial para testar se o servidor está rodando
app.get('/', (req: Request, res: Response) => {
    res.send('A API está rodando!');
});

// 1. GET - Listar todos os produtos
app.get('/produtos', (req: Request, res: Response) => {
    res.json(produtos); // devolve o array como JSON
});

// 2. GET - Buscar por ID 
app.get('/produtos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string); // convertendo o ID da URL para número
    const produto = produtos.find(p => p.id === id); // buscando o ID nos produtos

    if (!produto) {
        res.status(404).json({ message: "Produto não encontrado" }); // mensagem caso haja erro
        return;
    }
    res.json(produto);
});

// 3. POST - Criar novo produto
app.post('/produtos', (req: Request, res: Response) => {
   const { nome, preco } = req.body; // extraindo nome e preço do corpo da requisição
    
   // exigindo que nome e preço sejam enviados, caso contrário retorna erro 400
    if (!nome || !preco) {
        res.status(400).json({ message: "nome e preco são obrigatórios." });
        return;
    }

    // criando o novo produto com classe Produto e gerando um ID único de acordo com o tempo
    const novoProduto: Produto = {
        id: Date.now(),
        nome: nome,
        preco: preco
    };
    
    produtos.push(novoProduto); // salva no array
    
    // retorna 201 e o produto criado
    res.status(201).json(novoProduto);
});

// 4. PUT - Atualizar produto
app.put('/produtos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const index = produtos.findIndex(p => p.id === id); // encontrando o índice do produto

    // se não encontrar o produto a ser atualizado, retorna erro 404
    if (index === -1) {
         res.status(404).json({ message: "Produto não encontrado." });
        return;
    }

    // extraindo nome e preço do corpo da requisição
    const { nome, preco } = req.body;

    if (!nome && !preco) {
         res.status(400).json({ message: "Forneça nome ou preco para atualizar." });
         return;
    }

    // evidenciando o tipo do produto antigo
    const produtoAntigo = produtos[index] as Produto;

    // atualizando o produto, mantendo os valores antigos caso não sejam fornecidos novos
    produtos[index] = {
        ...produtoAntigo,
        nome: nome || produtoAntigo.nome,
        preco: preco || produtoAntigo.preco
    };

    // retornando o produto atualizado em JSON
    res.json(produtos[index]);
});

// 5. DELETE - Remover produto
app.delete('/produtos/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        res.status(404).json({ message: "Produto não encontrado" });
        return;
    }

    // Remove 1 item a partir daquele índice
    produtos.splice(index, 1);

    // Retorna 204 
    res.status(204).send();
});

// INICIAR O SERVIDOR
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});