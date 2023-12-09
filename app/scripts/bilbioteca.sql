CREATE TABLE aluno (
  nome VARCHAR(30),
  matricula VARCHAR(10),
  estado BOOLEAN,
  quantidade INTEGER,
  CONSTRAINT pk_matricula PRIMARY KEY (matricula),
  CONSTRAINT uk_matricula UNIQUE (matricula)
);

CREATE TABLE editora (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30),
  CONSTRAINT uk_nomeEd UNIQUE (nome)
);

CREATE TABLE autor ( -- tabela autor referente apenas ao autor principal do livro
  id SERIAL PRIMARY KEY,
  nome VARCHAR(30)
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

CREATE TABLE bibliotecario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(10),
  senha VARCHAR(8),
  CONSTRAINT uk_nomeBibl UNIQUE (nome)
);

CREATE TABLE emprestimo (
  id_emp SERIAL PRIMARY KEY,
  id_livro INTEGER,
  matricula VARCHAR(10),
  data_emprestimo DATE,
  data_devolucao DATE,
  estado BOOLEAN,  -- true devolução / false em empréstimo
  CONSTRAINT fk_id_livro FOREIGN KEY (id_livro) REFERENCES livro(id),
  CONSTRAINT fk_matricula FOREIGN KEY (matricula) REFERENCES aluno(matricula)
);

-- Inserindo dados na tabela aluno
INSERT INTO aluno (nome, matricula, estado, quantidade)
VALUES ('João Silva', '20230001', true, 0),
       ('Maria Souza', '20230002', true, 0),
       ('Pedro Santos', '20230003', true, 0);

-- Inserindo dados na tabela editora
INSERT INTO editora (nome)
VALUES ('Editora A'),
       ('Editora B'),
       ('Editora C');

-- Inserindo dados na tabela autor
INSERT INTO autor (nome)
VALUES ('Autor X'),
       ('Autor Y'),
       ('Autor Z');

-- Inserindo dados na tabela livro
INSERT INTO livro (nome, id_editora, id_autor, estado)
VALUES ('Livro 1', 1, 1, true),
       ('Livro 2', 2, 2, true),
       ('Livro 3', 3, 3, false);

-- Inserindo dados na tabela bibliotecario
INSERT INTO bibliotecario (nome, senha)
VALUES ('fulano', 'senha123'),
       ('ciclano', 'senha456');

-- Inserindo dados na tabela emprestimo
INSERT INTO emprestimo (id_livro, matricula, data_emprestimo, data_devolucao, estado)
VALUES (1, '20230001', '2023-01-01', '2023-01-15', false),
       (2, '20230002', '2023-02-01', '2023-02-15', false),
       (3, '20230003', '2023-03-01', '2023-03-15', true);