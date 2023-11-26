CREATE TABLE aluno (
  matricula VARCHAR(30),
  nome VARCHAR(30)
);

CREATE TABLE funcionario (
  nome VARCHAR(30),
  senha VARCHAR(30)
);

CREATE TABLE livro (
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
  data_devolucao DATE
);

INSERT INTO aluno (matricula, nome) VALUES ('2211100072', 'João Victor da Silva');
INSERT INTO aluno (matricula, nome) VALUES ('2211100073', 'Gabriel');
INSERT INTO funcionario (nome, senha) VALUES ('MAISA', '28072003');
INSERT INTO livro (nome, editora, estado) VALUES ('CHAPEUZINHO', 'JOÃO', TRUE);
INSERT INTO emprestimo (id_livro, matricula, data_emprestimo, data_devolucao) VALUES (1, '221110072', '2023-11-17', '2023-11-24');