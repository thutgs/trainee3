const express = require('express'); // Importando o express
const app = express(); 
const port = 3000; // Porta do localhost

app.use(express.json()); // configurando para utilizar JSON  

// BANCO DE DADOS EM MEMÓRIA
let produtos = [
    { id: 1, nome: "Notebook", preco: 2500 },
    { id: 2, nome: "Mouse", preco: 50 },
    { id: 3, nome: "Teclado", preco: 150 },
    { id: 4, nome: "Monitor", preco: 800 } 
];

// --- ROTAS ---

// Rota inicial para testar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('A API está rodando!');
});

// 1. GET - Listar todos os produtos
app.get('/produtos', (req, res) => {
    res.json(produtos); // devolve o array como JSON
});

// 2. GET - Buscar por ID 
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id); // convertendo o ID da URL para número
    const produto = produtos.find(p => p.id === id); // buscando o ID nos produtos

    if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" }); // mensagem caso haja erro
    }
    res.json(produto);
});

// 3. POST - Criar novo produto
app.post('/produtos', (req, res) => {
    const novoProduto = req.body; // pegando o dado que veio no corpo da requisição
    
    // definindo o ID como o proximo numero na sequência
    novoProduto.id = produtos.length + 1; 
    
    produtos.push(novoProduto); // salva no array
    
    // retorna 201 e o produto criado
    res.status(201).json(novoProduto);
});

// 4. PUT - Atualizar produto
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id); // encontrando o índice do produto

    // se não encontrar o produto a ser atualizado, retorna erro 404
    if (index === -1) {
        return res.status(404).json({ message: "Produto não encontrado" });
    }

    // atualizando o produto mantendo o ID original e trocando os dados
    produtos[index] = { id: id, ...req.body };

    res.json(produtos[index]);
});

// 5. DELETE - Remover produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Produto não encontrado" });
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