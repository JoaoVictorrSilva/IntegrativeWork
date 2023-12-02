CREATE TABLE aluno (
  nome VARCHAR(30),
  matricula VARCHAR(10),
  estado BOOLEAN,
  quantidade INTEGER,
  CONSTRAINT pk_matricula PRIMARY KEY (matricula),
  CONSTRAINT uk_matricula UNIQUE (matricula)
);

CREATE TABLE livro (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30),
  id_editora INTEGER,
  id_autor INTEGER,
  estado BOOLEAN, -- true disponível / false indisponível
  CONSTRAINT fk_id_editora FOREIGN KEY (id_editora) REFERENCES editora(id),
  CONSTRAINT fk_id_autor FOREIGN KEY (id_autor) REFERENCES autor(id)
);

CREATE TABLE editora (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30),
  CONSTRAINT uk_nome UNIQUE (nome)
);

CREATE TABLE autor ( -- tabela autor referente apenas ao autor principal do livro
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30),
  CONSTRAINT uk_nome UNIQUE (nome)
);

CREATE TABLE bibliotecario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(10),
  senha VARCHAR(8),
  CONSTRAINT uk_nome UNIQUE (nome)
);

CREATE TABLE emprestimo (
  id_emp SERIAL PRIMARY KEY,
  id_livro INTEGER,
  matricula INTEGER,
  data_emprestimo DATE,
  data_devolucao DATE,
  estado BOOLEAN,  -- true devolução / false em empréstimo
  CONSTRAINT fk_id_livro FOREIGN KEY (id_livro) REFERENCES livro(id),
  CONSTRAINT fk_matricula FOREIGN KEY (matricula) REFERENCES aluno(matricula)
);

INSERT INTO aluno (matricula, nome, estado, quantidade) VALUES ('2211100072', 'JOÃO VICTOR', true, 0);
INSERT INTO aluno (matricula, nome, estado, quantidade) VALUES ('2211100073', 'GABRIEL', true, 0);
INSERT INTO bibliotecario (nome, senha) VALUES ('MAISA', '28072003');
INSERT INTO autor (nome) VALUES ('DENIO');
INSERT INTO editora (nome) VALUES ('DC');
INSERT INTO livro (nome, id_editora, id_autor, estado) VALUES ('CHAPEUZINHO', 1, 1, true);
INSERT INTO emprestimo (id_livro, matricula, data_emprestimo, data_devolucao, estado) VALUES (1, '2211100072', '2023-11-17', '2023-11-24', false);