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

// cadastro de empréstimo:
app.post("/cadastro/emprestimo", async (req, res) => {
  try {
      const matricula = req.body.matricula;
      const livroId = req.body.livroId;
      const dataEmprestimo = req.body.dataEmprestimo;
      const dataDevolucao = req.body.dataDevolucao;

      console.log(`Matricula ALuno: ${matricula} - Livro ID: ${livroId} - Data Emprestimo: ${dataEmprestimo} - Data Devolucao: ${dataDevolucao}`);

      await db.none(
          "INSERT INTO emprestimo (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES ($1, $2, $3, $4);",
          [matricula, livroId, dataEmprestimo, dataDevolucao]
      );

      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

/* ----------------------------------------------------------------------------------------------------------------------------- */
// LIVRO

// cadastro:
app.post("/cadastro/livro", async (req, res) => {
  try {
      const livroNome = req.body.nome;
      const livroEditora = req.body.editora;

      const editora = await db.oneOrNone(  // Verifica se a editora existe
          "SELECT id FROM editora WHERE nome = $1;",
          [livroEditora]
      );

      if (editora) {
          console.log(`Nome: ${livroNome} - Editora: ${livroEditora}`);
          await db.none(
              "INSERT INTO livro (nome, editora, estado) VALUES ($1, $2, $3);",
              [livroNome, livroEditora, "TRUE"]
          );
          res.sendStatus(200);
      } else {
          res.status(404).send("Editora não encontrada");
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

      const livro = await db.oneOrNone(
          "SELECT * FROM livro WHERE id = $1;",
          [livroId]
      );

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
app.put("/atualizar/livro", async (req, res) => {
  try {
      const livroId = req.params.id;
      const novoNome = req.body.nome; // Novo nome do livro
      const novaEditora = req.body.editora; // Nova editora do livro

      const livro = await db.oneOrNone(
          "SELECT * FROM livro WHERE id = $1;",
          [livroId]
      );

      if (livro) {
          await db.none(
              "UPDATE livro SET nome = $1, editora = $2 WHERE id = $3;",
              [novoNome, novaEditora, livroId]
          );

          res.sendStatus(200);
      } else {
          res.status(404).send("Livro não encontrado");
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

      const livro = await db.oneOrNone(
          "SELECT * FROM livro WHERE id = $1;",
          [livroId]
      );

      if (livro) {
          await db.none(
              "DELETE FROM livro WHERE id = $1;",
              [livroId]
          );

          res.sendStatus(200);
      } else {
          res.status(404).send("Livro não encontrado");
      }
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

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
      const livros = await db.any("SELECT * FROM livro WHERE status = FALSE;");
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

      console.log(`Nome: ${alunoNome} - Matricula: ${alunoMatricula}`);
      
      await db.none(
          "INSERT INTO aluno (nome, matricula) VALUES ($1, $2);",
          [alunoNome, alunoMatricula, 0]
      );

      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// consulta:
app.get("/aluno/consulta", async (req, res) => {
  try {
      const alunoMatr = req.params.matricula;

      const aluno = await db.oneOrNone(
          "SELECT * FROM aluno WHERE matricula = $1;",
          [alunoMatr]
      );

      if (aluno) {
          res.status(200).json(aluno);
      } else {
          res.status(404).send("Aluno não encontrado");
      }
  } catch (error) {
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

      const aluno = await db.oneOrNone(
          "SELECT * FROM aluno WHERE matricula = $1;",
          [alunoMatr]
      );

      if (aluno) {
          await db.none(
              "UPDATE aluno SET nome = $1, quantidade = $2;",
              [attNome, attQuant]
          );

          res.sendStatus(200);
      } else {
          res.status(404).send("Aluno não encontrado");
      }
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});

// exclusão:
app.delete("/aluno/delete", async (req, res) => {
  try {
      const alunoMatr = req.params.matricula;

      await db.none(
          "DELETE FROM aluno WHERE matricula = $1;",
          [alunoMatr]
      );

      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(400);
  }
});