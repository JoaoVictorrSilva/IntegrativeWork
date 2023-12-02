const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "95034107";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/db_biblioteca`);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
// LIVRO -- get/post/put/delete

// cadastro: -- ok
app.post("/cadastro/livro", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const livroAutor = req.body.autor;
        const livroEditora = req.body.editora;
        const livroQuantidade = req.body.quantidade;
        const quantidade = parseInt(livroQuantidade); //quantidade do mesmo livro a ser cadastrado
        const id_autor = parseInt(livroAutor);
        const id_editora = parseInt(livroEditora);

        const livroCadastrado = await db.oneOrNone("SELECT id FROM livro WHERE nome = $1", [livroNome]);
        const editora = await db.oneOrNone("SELECT id FROM editora WHERE id = $1;", [id_editora]);
        const autor = await db.oneOrNone("SELECT id FROM autor WHERE id = $1", [id_autor]);

        if (editora && autor && !livroCadastrado) {
            for (let i = 0; i < quantidade; i++) {
                console.log(`Nome: ${livroNome} - Editora: ${id_editora}`);
                await db.none("INSERT INTO livro (nome, id_editora, id_autor, estado) VALUES ($1, $2, $3);", [livroNome, id_editora, id_autor, true]);
            }
            
            res.sendStatus(200); // status após o término da inserção
        } 
        
        else {res.status(404).send("Informações inválidas para cadastro");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta: -- ok
app.get("/consulta/livro", async (req, res) => {
    try {
        const livroId = req.body.id;
        const livro_id = parseInt(livroId);
        const livro = await db.oneOrNone("SELECT * FROM livro WHERE id = $1;", [livro_id]);

        if (livro) {res.status(200).json(livro);} 
      
        else {res.status(404).send("Livro não encontrado");}
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// atualização: -- ok
app.put("/atualizar/livro", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const novoNome = req.body.novoNome;
        const novaEditora = req.body.novaEditora;
        const novoAutor = req.body.novoAutor;
        const id_editora = parseInt(novaEditora);
        const id_autor = parseInt(novoAutor);

        const livrosParaAtualizar = await db.any("SELECT id FROM livro WHERE nome = $1", [livroNome]); // quantidade do mesmo livro para atualizar

        if (livrosParaAtualizar.length > 0) { // true --> tem livro para att
            await Promise.all(
                livrosParaAtualizar.map(async (livro) => {
                    await db.none("UPDATE livro SET nome = $1, id_editora = $2, id_autor = $3 WHERE id = $4",[novoNome, id_editora, id_autor, livro.id]);
                })
            );
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Nenhum livro encontrado para atualização");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// exclusão: -- ok -- pedir para professor banco sobre quais outras deletar deletando tal...
app.delete("/delete/livro", async (req, res) => {
    try {
        const livroId = req.body.id;
        const id_livro = parseInt(livroId);
        const livro = await db.oneOrNone("SELECT * FROM livro WHERE id = $1;", [id_livro]);

        if (livro) {
            await db.none("DELETE FROM livro WHERE id = $1;", [id_livro]);
            res.sendStatus(200);
        } 
        else {res.status(404).send("Livro não encontrado");}

    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consultas gerais livros:

// todos os livros cadastrados: -- ok
app.get("/consulta/livros", async (req, res) => {
    try {
        const livros = await db.any("SELECT * FROM livro ORDER BY nome;");
        console.log('Retornando todos os livros.');
        res.json(livros).status(200);
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// livros disponíveis: -- ok
app.get("/consulta/livros/disponiveis", async (req, res) => {
    try {
        const livros = await db.any("SELECT * FROM livro WHERE status = $1 ORDER BY nome;", [true]);
        console.log('Retornando todos os livros disponiveis.');
        res.json(livros).status(200);
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// livros em empréstimos: -- ok
app.get("/consulta/livros/indisponiveis", async (req, res) => {
    try {
        const livros = await db.any("SELECT * FROM livro WHERE status = $1 ORDER BY nome;", [false]);
        console.log('Retornando todos os livros em empréstimo.');
        res.json(livros).status(200);
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
// ALUNO

// cadastro: -- ok
app.post("/cadastro/aluno", async (req, res) => {
    try {
        const alunoNome = req.body.nome;
        const alunoMatricula = req.body.matricula;
        const alunoCadastrado = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [alunoMatricula]);

        if(!alunoCadastrado){
            console.log(`Nome: ${alunoNome} - Matricula: ${alunoMatricula}`);
      
            await db.none("INSERT INTO aluno (nome, matricula, quantidade) VALUES ($1, $2, $3);", [alunoNome, alunoMatricula, 0]);
    
            res.sendStatus(200);
        } 
        
        else {
            console.log("Aluno já cadastrado");
            res.status(409).send("Aluno já cadastrado");
        }
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta: -- ok
app.get("/aluno/consulta", async (req, res) => {
    try {
        const alunoMatr = req.body.matricula;
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1;", [alunoMatr]);

        if (aluno) {res.status(200).json(aluno);} 
    
        else {res.status(404).send("Aluno não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// atualização: -- no geral ok, mas ver com o professor sobre atualizar o estado (true/false)
app.put("/atualizar/aluno", async (req, res) => {
    try {
        const alunoMatr = req.body.matricula;
        const attNome = req.body.nome;
        const attQuant = req.body.quantidade;
        const quantidade = parseInt(attQuant);
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1;", [alunoMatr]);

        if (aluno) {
            await db.none("UPDATE aluno SET nome = $1, quantidade = $2 WHERE matricula = $3;", [attNome, quantidade, alunoMatr]);
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Aluno não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
    }
});

// exclusão: -- ok
app.delete("/aluno/delete", async (req, res) => {
    try {
        const alunoMatr = req.body.matricula;
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [alunoMatr]);

        if (aluno) {
            await db.none("DELETE FROM aluno WHERE matricula = $1;", [alunoMatr]);
            console.log("Aluno deletado com sucesso");
            res.sendStatus(200);
        } 
        
        else {
            console.log("Aluno não encontrado");
            res.status(404).send("Aluno não encontrado");
        }
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
// EMPRÉSTIMOS - DEVOLUÇÃO:

// cadastro de empréstimo: -- ok
app.post("/emprestimo/cadastro", async (req, res) => {
    try {
        const matricula = req.body.matricula;
        const livroId = req.body.livroId;
        const id_livro = parseInt(livroId);

        const livroDisponivel = await db.oneOrNone("SELECT id FROM livro WHERE id = $1 AND estado = $2", [id_livro, true]);
        const alunoExistente = await db.oneOrNone("SELECT id FROM aluno WHERE matricula = $1", [matricula]);
        const quantidadeEmprestimos = await db.oneOrNone("SELECT quantidade FROM aluno WHERE matricula = $1", [matricula]);

        if (livroDisponivel && alunoExistente && quantidadeEmprestimos !== null && quantidadeEmprestimos < 1) {
            const dataEmprestimo = new Date();
            const dataDevolucao = new Date();
            dataDevolucao.setDate(dataDevolucao.getDate() + 7); // Devolução em uma semana
            
            await db.tx(async t => {
                await t.none("INSERT INTO emprestimo (livro_id, matricula, data_emprestimo, data_devolucao, estado) VALUES ($1, $2, $3, $4, $5);", [id_livro, matricula, dataEmprestimo, dataDevolucao, false]);
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [true, id_livro]);
                await t.none("UPDATE aluno SET quantidade = $1 WHERE id = $2", [1, matricula]);
            });

            res.sendStatus(200);
        } 
        
        else {res.status(400).send("Não foi possível realizar o empréstimo");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500); 
    }
});

// cadastro de devolução: -- ok -- perguntar professor se está certo ser post (put?)
app.post("/emprestimo/devolucao", async (req, res) => {
    try {
        const livroId = req.body.idLivro;
        const id_livro = parseInt(livroId);
        const matricula = req.body.matricula;

        const emprestimoAtual = await db.oneOrNone("SELECT * FROM emprestimo WHERE livro_id = $1 AND matricula = $2 AND estado = $3", [id_livro, matricula, true]);

        if (emprestimoAtual) {
            await db.tx(async t => {
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [true, id_livro]); // set livro true --> disponivel
                await t.none("UPDATE aluno SET quantidade = $1 WHERE matricula = $2", [0, matricula]);
                await t.none("UPDATE emprestimo SET estado = $1 WHERE livro_id = $2 AND usuario_id = $3", [false, id_livro, matricula]);
            });

            res.sendStatus(200);
        } 
        
        else {res.status(400).send("Empréstimo não encontrado ou já devolvido");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// consulta de um empréstimo: --ok
app.get("/emprestimo/consulta", async (req, res) => {
    try {
        const matricula = req.query.matricula;
        const idLivro = req.query.id_livro;
        const id_livro = parseInt(idLivro);
        
        const emprestimos = await db.any("SELECT * FROM emprestimo WHERE id_livro = $1 AND matricula = $2", [id_livro, matricula]);

        if (emprestimos.length > 0) {
            res.status(200).json(emprestimos);
            console.log("Retornando empréstimo");
        } 
        
        else {res.status(404).send("Nenhum empréstimo encontrado para essa matrícula e livro");}

    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização de um empréstimo: -- ok
app.put("/emprestimo/atualizar", async (req, res) => {
    try {
        const idEmp = req.body.id_emprestimo;
        let id = parseInt(idEmp);
        const emprestimo = await db.oneOrNone("SELECT * FROM emprestimo WHERE id_emp = $1", [id]);

        if (emprestimo) {
            const dataDevAtual = new Date(emprestimo.data_devolucao);
            dataDevAtual.setDate(dataDevAtual.getDate() + 7);
            
            await db.none("UPDATE emprestimo SET data_devolucao = $1 WHERE id_emp = $2", [dataDevAtual, id]);
            res.sendStatus(200);
        }
        
        else {res.sendStatus(400).send("Empréstimo não encontrado");}
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// exclusão de empréstimo: -- ok
app.delete("/emprestimo/deletando", async (req, res) => {
    try {
        const idEmp = req.body.id_emprestimo;
        let id = parseInt(idEmp);
        await db.none("DELETE FROM emprestimo WHERE id_emp = $1", [id]);
        res.sendStatus(200);
    } 
    
    catch (error) {
        console.log(error);
        res.status(400).send("Erro ao excluir o empréstimo. Verifique o ID informado.");
    }
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
//AUTOR:

// consulta: -- ok
app.get("/autor/consulta", async (req, res) => {
    try {
        const idAutor = req.body.id_autor;
        const id = parseInt(idAutor);
        const autor = await db.any("SELECT * FROM autor WHERE id = $1", [id]);
        
        if (autor.length > 0) {
            res.status(200).json(autor);
            console.log("Retornando um autor principal");
        } 
        
        else {res.status(404).send("Autor não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// consulta: -- ok
app.get("/autor/consulta", async (req, res) => {
    try {
        const autores = await db.any("SELECT * FROM autor");
        
        if (autores.length > 0) {
            res.status(200).json(autores);
            console.log("Retornando todos os autores principais");
        }
        
        else {res.status(404).send("Nenhum autor encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização: -- ok
app.post("/autor/atualizacao", async (req, res) => {
    try {
        const idAutor = req.body.id_autor;
        const novoNome = req.body.novo_nome;
        const id = parseInt(idAutor);

        const autorExistente = await db.oneOrNone("SELECT * FROM autor WHERE id = $1", [id]);

        if (autorExistente) {
            await db.none("UPDATE autor SET nome = $1 WHERE id = $2", [novoNome, id]);
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Autor não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// cadastro: -- ok
app.put("/autor/cadastro", async (req, res) => {
    try {
       const nome = req.body.nome;
       await db.none("INSERT INTO autor (nome) VALUES ($1)", [nome]);
       res.sendStatus(200);
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// deletando: -- ok
app.delete("/autor/deletando", async (req, res) => {
    try {
        const idAutor = req.body.id_autor;
        const id = parseInt(idAutor);
        
        await db.none("DELETE FROM autor WHERE id = $1", [id]);
        
        console.log("Autor deletado");
        res.sendStatus(200);
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
//EDITORA:
// consulta: -- ok
app.get("/editora/consulta", async (req, res) => {
    try {
        const idEditora = req.body.id_editora;
        const id = parseInt(idEditora);
        const editora = await db.any("SELECT * FROM editora WHERE id = $1", [id]);
        
        if (editora) {
            res.status(200).json(autor);
            console.log("Retornando um autor principal");
        } 
        
        else {res.status(404).send("Autor não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// consulta de todas as editoras: -- ok
app.get("/editora/consulta", async (req, res) => {
    try {
        const editoras = await db.any("SELECT * FROM editora");
        
        if (editoras.length > 0) {
            res.status(200).json(editoras);
            console.log("Retornando todas as editoras");
        }
        
        else {res.status(404).send("Nenhuma editora encontrada");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização: -- ok
app.post("/editora/atualizacao", async (req, res) => {
    try {
        const idEditora = req.body.id_editora;
        const novoNome = req.body.novo_nome;
        const id = parseInt(idEditora);

        const editoraExistente = await db.oneOrNone("SELECT * FROM editora WHERE id = $1", [id]);

        if (editoraExistente) {
            await db.none("UPDATE editora SET nome = $1 WHERE id = $2", [novoNome, id]);
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Editora não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


// cadastro: -- ok
app.put("/editora/cadastro", async (req, res) => {
    try {
       const nome = req.body.nome;
       await db.none("INSERT INTO editora (nome) VALUES ($1)", [nome]);
       res.sendStatus(200);
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// deletando: -- ok
app.delete("/editora/deletando", async (req, res) => {
    try {
        const idEditora = req.body.id_editora;
        const id = parseInt(idEditora);
        
        await db.none("DELETE FROM editora WHERE id = $1", [id]);
        
        console.log("Editora deletada");
        res.sendStatus(200);
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});