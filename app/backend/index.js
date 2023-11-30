const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "95034107";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/progII`);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

/* ----------------------------------------------------------------------------------------------------------------------------- */
// LIVRO

// cadastro:
app.post("/cadastro/livro", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const livroAutor = req.body.autor;
        const livroEditora = req.body.editora;
        const livroQuantidade = req.body.quantidade;
        const quantidade = parseInt(livroQuantidade); //quantidade do mesmo livro a ser cadastrado

        const livroCadastrado = await db.oneOrNone("SELECT id FROM livro WHERE nome = $1", [livroNome]);
        const editora = await db.oneOrNone("SELECT id FROM editora WHERE nome = $1;", [livroEditora]);
        const autor = await db.oneOrNone("SELECT id FROM autor WHERE nome = $1", [livroAutor]);

        if (editora && autor && !livroCadastrado) {
            for (let i = 0; i < quantidade; i++) {
                console.log(`Nome: ${livroNome} - Editora: ${livroEditora}`);
                await db.none(
                    "INSERT INTO livro (nome, editora, estado) VALUES ($1, $2, $3);",
                    [livroNome, livroEditora, "TRUE"]
                );
            }
            res.sendStatus(200); // status após o término da inserção
        } else {
            res.status(404).send("Informações inválidas para cadastro");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta:
app.get("/consulta/livro", async (req, res) => {
  try {
      const livroId = req.params.id;
      const livro = await db.oneOrNone("SELECT * FROM livro WHERE id = $1;", [livroId]);

      if (livro) {
          res.status(200).json(livro); // Retorna os dados do livro como JSON
      } else {
          res.status(404).send("Livro não encontrado");
      }
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// atualização:
app.put("/atualizar/livro/:nome", async (req, res) => {
    try {
        const livroNome = req.params.nome;
        const novoNome = req.body.novoNome;
        const novaEditora = req.body.novaEditora;
        const novoAutor = req.body.novoAutor;

        const livrosParaAtualizar = await db.any("SELECT id FROM livro WHERE nome = $1", [livroNome]); // quantidade do mesmo livro para atualizar

        if (livrosParaAtualizar.length > 0) { // true --> tem livro para att
            await Promise.all(
                livrosParaAtualizar.map(async (livro) => {
                    await db.none(
                        "UPDATE livro SET nome = $1, editora = $2, autor = $3 WHERE id = $4",
                        [novoNome, novaEditora, novoAutor, livro.id]
                    );
                })
            );
            res.sendStatus(200);
        } else {
            res.status(404).send("Nenhum livro encontrado para atualização");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// exclusão:
app.delete("/delete/livro", async (req, res) => {
  try {
      const livroId = req.params.id;

      const livro = await db.oneOrNone("SELECT * FROM livro WHERE id = $1;", [livroId]);

      if (livro) {
          await db.none("DELETE FROM livro WHERE id = $1;", [livroId]);
          res.sendStatus(200);
      } else {
          res.status(404).send("Livro não encontrado");
      }
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// consultas gerais livros:

// todos os livros cadastrados:
app.get("/consulta/livros", async (req, res) => {
  try {
      const livros = await db.any("SELECT * FROM livro;");
      console.log('Retornando todos os livros.');
      res.json(livros).status(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// livros disponíveis:
app.get("/consulta/livros/disponiveis", async (req, res) => {
  try {
      const livros = await db.any("SELECT * FROM livro WHERE status = $1;", true);
      console.log('Retornando todos os livros disponiveis.');
      res.json(livros).status(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// livros em empréstimos:
app.get("/consulta/livros/indisponiveis", async (req, res) => {
  try {
      const livros = await db.any("SELECT * FROM livro WHERE status = FALSE;");
      console.log('Retornando todos os livros em emprestimo.');
      res.json(livros).status(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

/* ----------------------------------------------------------------------------------------------------------------------------- */
// ALUNO

// cadastro:
app.post("/cadastro/aluno", async (req, res) => {
    try {
        const alunoNome = req.body.nome;
        const alunoMatricula = req.body.matricula;
        const alunoCadastrado = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [alunoMatricula]);

        if(!alunoCadastrado){
            console.log(`Nome: ${alunoNome} - Matricula: ${alunoMatricula}`);
      
            await db.none("INSERT INTO aluno (nome, matricula, quantidade) VALUES ($1, $2, $3);", [alunoNome, alunoMatricula, 0]);
    
            res.sendStatus(200);
        } else {
            console.log("Aluno já cadastrado");
            res.status(409).send("Aluno já cadastrado");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta:
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

// atualização:
app.put("/atualizar/aluno", async (req, res) => {
    try {
        const alunoMatr = req.params.matricula;
        const attNome = req.body.nome;
        const attQuant = req.body.quantidade;
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1;", [alunoMatr]);

        if (aluno) {
            await db.none("UPDATE aluno SET nome = $1, quantidade = $2;", [attNome, attQuant]);
            res.sendStatus(200);
        } 
        else {res.status(404).send("Aluno não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// exclusão:
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

/* -------------------------------------------------------------------------------------------- */
// EMPRÉSTIMOS - DEVOLUÇÃO:

// cadastro de empréstimo:
app.post("/emprestimo/novo", async (req, res) => {
    try {
        const matricula = req.body.matricula;
        const livroId = req.body.livroId;

        const livroDisponivel = await db.oneOrNone("SELECT id FROM livro WHERE id = $1 AND estado = $2", [livroId, true]);
        const alunoExistente = await db.oneOrNone("SELECT id FROM aluno WHERE matricula = $1", [matricula]);
        const quantidadeEmprestimos = await db.oneOrNone("SELECT quantidade FROM aluno WHERE matricula = $1", [matricula]);

        if (livroDisponivel && alunoExistente && quantidadeEmprestimos && quantidadeEmprestimos < 1) {
            const dataEmprestimo = new Date();
            const dataDevolucao = new Date();
            dataDevolucao.setDate(dataDevolucao.getDate() + 7); // Devolução em uma semana
            
            await db.tx(async t => {
                await t.none("INSERT INTO emprestimo (usuario_id, livro_id, data_emprestimo, data_devolucao, estado) VALUES ($1, $2, $3, $4);", [matricula, livroId, dataEmprestimo, dataDevolucao, false]);
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [true, livroId]);
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

// cadastro de devolução:
app.post("/emprestimo/devolucao", async (req, res) => {
    try {
        const livroId = req.body.idLivro;
        const matricula = req.body.matricula;

        const emprestimoAtual = await db.oneOrNone("SELECT * FROM emprestimo WHERE livro_id = $1 AND matricula = $2 AND estado = $3", [livroId, matricula, true]);

        if (emprestimoAtual) {
            await db.tx(async t => {
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [false, livroId]);
                await t.none("UPDATE aluno SET quantidade = $1 WHERE matricula = $2", [0, matricula]);
                await t.none("UPDATE emprestimo SET estado = $1 WHERE livro_id = $2 AND usuario_id = $3", [false, livroId, matricula]);
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

// consulta de um empréstimo
app.get("/emprestimo/consulta", async (req, res) => {
    try {
        const matricula = req.query.matricula;
        const idLivro = req.query.matricula;
        const emprestimos = await db.one("SELECT * FROM emprestimo WHERE id_livro = $1 AND matricula = $1", [idLivro, matricula]);

        if (emprestimos) {
            res.status(200).json(emprestimos);
            console.log("Retornando emprestimos");
        } 
        else {
            res.status(404).send("Nenhum emprestimo encontrado para essa matricula");
        }
    } 
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização de um empréstimo

// exclusão de empréstimo

/* ----------------------------------------------------------------------------------------------------------------------------------- */
//AUTOR:

/* ------------------------------------------------------------------------------------------------------------------------------------ */
//DIRETOR: