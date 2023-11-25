const express = require("express");
const cors = require("cors");

const pgp = require("pg-promise")({});

const usuario = "postgres";
const senha = "95034107";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/progII`);

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

app.post("/login", async (req, res) => {

});

//cadastro livro:
app.post("/livro", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const livroEditora = req.body.editora;
        console.log(`Nome: ${livroNome} - Editora: ${livroEditora}`);
        db.none(
            "INSERT INTO livro (nome, editora, estado) VALUES ($1, $2);",
            [livroNome, livroEditora, `${true}`]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

//retornar livros cadastrados:
app.get("/livros", async (req, res) => {
    try {
        const livros = await db.any("SELECT * FROM livro;");
        console.log('Retornando todos os livros.');
        res.json(livros).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// db.any - 0 ou mais resultados
// db.all - retornar 1 ou mais resultados
// db.one - apenas 1 resultado
// db.none - não retorna resultado - quando atualizamos as estruturas do BD

/*
app.get("/clientes", async (req, res) => {
    try {
        const clientes = await db.any("SELECT * FROM clientes;");
        console.log('Retornando todos clientes.');
        res.json(clientes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.get("/cliente", async (req, res) => {
    try {
        const clienteId = parseInt(req.query.id);
        console.log(`Retornando ID: ${clienteId}.`);
        const clientes = await db.one(
            "SELECT id, nome, email FROM clientes WHERE id = $1;",
            clienteId
        );
        res.json(clientes).status(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

app.post("/cliente", async (req, res) => {
    try {
        const clienteNome = req.body.nome;
        const clienteEmail = req.body.email;
        console.log(`Nome: ${clienteNome} - Email: ${clienteEmail}`);
        db.none(
            "INSERT INTO clientes (nome, email) VALUES ($1, $2);",
            [clienteNome, clienteEmail]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});



/*
app.get("/cursos", (req, res) => {
    res.json(cursos);
})

app.get("/horarios/cc", (req, res) => {
    res.json(horarios_cc);
})

app.post('/follow', (req, res) => {
    console.log('Recebi um follow');
})

app.post('/unfollow', (req, res) => {
    console.log('Recebi unfollow');
})
*/