CREATE TABLE alunos (
  matricula INTEGER,
  nome VARCHAR(30)
);

CREATE TABLE funcionario (
  nome VARCHAR(30),
  senha VARCHAR(30)
);

CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30),
  editora VARCHAR(30),
  estado BOOLEAN
);

CREATE TABLE emprestimo (
  id_emp SERIAL PRIMARY KEY,
  id_livro INTEGER,
  matricula INTEGER,
  data_emprestimo DATE,
  data_devolucao DATA
);