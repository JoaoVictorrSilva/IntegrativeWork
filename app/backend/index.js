const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "gabriel09";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/db_biblioteca`);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
// LIVRO -- TUDO OK

// cadastro:
app.post("/livro/cadastro", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const livroAutor = req.body.autor;
        const livroEditora = req.body.editora;
        const livroQuantidade = req.body.quantidade;
        const quantidade = parseInt(livroQuantidade);

        const id_editora = await db.oneOrNone("SELECT id FROM editora WHERE nome = $1;", [livroEditora]);
        const id_autor = await db.oneOrNone("SELECT id FROM autor WHERE nome = $1", [livroAutor]);

        if (id_editora && id_autor) {
            console.log(`Cadastrando o livro "${livroNome}" - ${quantidade} total`);
            for (let i = 0; i < quantidade; i++) {
                await db.none("INSERT INTO livro (nome, id_editora, id_autor, estado) VALUES ($1, $2, $3, $4);", 
                [livroNome, id_editora.id, id_autor.id, true]);
            }
            
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Informações inválidas para cadastro");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta:
app.get("/livro/consulta/:nome", async (req, res) => {
    try {
        const livroNome = req.params.nome;
        const livro = await db.any("SELECT id, nome, id_autor, id_editora, CASE WHEN estado = true THEN 'Disponível' WHEN estado = false THEN 'Indisponível' END AS estado FROM livro WHERE nome = $1 ORDER BY id;", [livroNome]);

        if (livro) {res.status(200).json(livro);} 
        else {res.status(404).send("Livro não encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// atualização:
app.put("/livro/atualizar", async (req, res) => {
    try {
        const livroNome = req.body.nome;
        const novoNome = req.body.novoNome;
        const novaEditora = req.body.novaEditora;
        const novoAutor = req.body.novoAutor;
        
        let id_editora = parseInt(novaEditora);
        let id_autor = parseInt(novoAutor);
        const existeEditora = await db.oneOrNone("SELECT * FROM editora WHERE id = $1", [id_editora]);
        const existeAutor = await db.oneOrNone("SELECT * FROM autor WHERE id = $1", [id_autor]);

        const livrosParaAtualizar = await db.any("SELECT id FROM livro WHERE nome = $1", [livroNome]);

        if (livrosParaAtualizar.length > 0 && existeAutor && existeEditora) {
            await Promise.all(
                livrosParaAtualizar.map(async (livro) => {
                    await db.none("UPDATE livro SET nome = $1, id_editora = $2, id_autor = $3 WHERE id = $4", [novoNome, id_editora, id_autor, livro.id]);
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
app.delete("/livro/delete", async (req, res) => {
    try {
        const livroId = req.body.id;
        const id_livro = parseInt(livroId);
        const livro = await db.oneOrNone("SELECT * FROM livro WHERE id = $1;", [id_livro]);

        if (livro) {
            const emprestimo = await db.oneOrNone("SELECT * FROM emprestimo WHERE id_livro = $1 AND estado = $2", [id_livro, false]);
            if(emprestimo){
                await db.tx(async t => {
                    await t.none("UPDATE aluno SET quantidade = $1 WHERE matricula = $2", [0, emprestimo.matricula]);
                    await t.none("UPDATE emprestimo SET estado = $1 WHERE id_livro = $2 AND estado = $3 AND matricula = $4", [true, id_livro, false, emprestimo.matricula]);           
                });
            }
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

// todos os livros cadastrados: 
app.get("/consulta/livros", async (req, res) => {
    try {
        const livros = await db.any("SELECT id, nome, id_autor, id_editora, estado, CASE WHEN estado = true THEN 'Disponível' WHEN estado = false THEN 'Indisponível' END AS estado FROM livro ORDER BY nome;");
        console.log('Retornando todos os livros.');
        res.json(livros).status(200);
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// livros disponíveis: 
app.get("/consulta/livros/disponiveis", async (req, res) => {
    try {
        const livros = await db.any("SELECT id, nome, id_editora, id_autor, CASE WHEN estado = true THEN 'Disponível' END AS estado FROM livro WHERE estado = $1 ORDER BY nome;", [true]);
        console.log('Retornando todos os livros disponiveis.');
        res.json(livros).status(200);
    } 
  
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// livros em empréstimos:
app.get("/consulta/livros/indisponiveis", async (req, res) => {
    try {
        const livros = await db.any("SELECT id, nome, id_editora, id_autor, CASE WHEN estado = false THEN 'Indisponível' END AS estado FROM livro WHERE estado = $1 ORDER BY nome;", [false]);
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

// cadastro:
app.post("/aluno/cadastro", async (req, res) => {
    try {
        const alunoNome = req.body.nome;
        const alunoMatricula = req.body.matricula;
        const alunoCadastrado = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [alunoMatricula]);

        if(!alunoCadastrado){
            console.log(`Nome: ${alunoNome} - Matricula: ${alunoMatricula}`);     
            await db.none("INSERT INTO aluno (nome, matricula, estado, quantidade) VALUES ($1, $2, $3, $4);", [alunoNome, alunoMatricula, true, 0]);   
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

// consulta:
app.get("/aluno/consulta/:matr", async (req, res) => {
    try {
        const alunoMatr = req.params.matr;
        const aluno = await db.oneOrNone("SELECT nome, matricula, estado, quantidade, CASE WHEN estado = true THEN 'Permitido' WHEN estado = false THEN 'Proibido' END AS estado FROM aluno WHERE matricula = $1;", [alunoMatr]);
        
        if (aluno) {
            res.status(200).json([aluno]);
        } else {
            res.status(404).send("Aluno não encontrado");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// consulta de todos:
app.get("/aluno/consultas", async (req, res) => {
    try {
        const alunos = await db.any("SELECT nome, matricula, estado, quantidade, CASE WHEN estado = true THEN 'Permitido' WHEN estado = false THEN 'Proibido' END AS estado FROM aluno ORDER BY nome");
        
        if (alunos.length > 0) {
            res.status(200).json(alunos);
            console.log("Retornando todos os alunos");
        }
        
        else {res.status(404).send("Nenhum aluno encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização:
app.put("/aluno/atualizar", async (req, res) => {
    try {
        const alunoMatr = req.body.matricula;
        const attNome = req.body.nome;
        const attQuant = req.body.quantidade;
        const quantidade = parseInt(attQuant);
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1;", [alunoMatr]);

        if (aluno && (quantidade == 1 || quantidade == 0)) {
            await db.none("UPDATE aluno SET nome = $1, quantidade = $2 WHERE matricula = $3;", [attNome, quantidade, alunoMatr]);
            res.sendStatus(200);
        } 
        
        else {res.status(404).send("Aluno nao encontrado ou dados invalidos");}
    } 
    
    catch (error) {
        console.log(error);
    }
});

// exclusão:
app.delete("/aluno/deletar", async (req, res) => {
    try {
        const alunoMatr = req.body.matricula;
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [alunoMatr]);

        if (aluno) {
            const emprestimo = await db.oneOrNone("SELECT * FROM emprestimo WHERE matricula = $1 AND estado = $2", [alunoMatr, false]);

            if (emprestimo) {
                console.log("O aluno tem empréstimos pendentes.");
                return res.status(400).send("O aluno tem empréstimos pendentes e não pode ser excluído.");
            }

            await db.none("DELETE FROM aluno WHERE matricula = $1", [alunoMatr]);
            console.log("Aluno deletado com sucesso");
            res.sendStatus(200);
        } else {
            console.log("Aluno não encontrado");
            res.status(404).send("Aluno não encontrado");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
// EMPRÉSTIMOS - DEVOLUÇÃO:

// cadastro de empréstimo: -- ok mas falta arrumar as datas 
app.post("/emprestimo/cadastro", async (req, res) => {
    try {
        const matricula = req.body.matricula;
        const livroId = req.body.idLivro;
        const id_livro = parseInt(livroId);

        const livroDisponivel = await db.oneOrNone("SELECT * FROM livro WHERE id = $1 AND estado = $2", [id_livro, true]);
        const aluno = await db.oneOrNone("SELECT * FROM aluno WHERE matricula = $1", [matricula]);
        let quantEmp = parseInt(aluno.quantidade);

        if (livroDisponivel && aluno && quantEmp !== 1) {
            const dataEmprestimo = new Date();
            const data_emprestimo = dataEmprestimo.toISOString().split('T')[0]; // Obtém a data atual formatada

            const dataDevolucao = new Date(dataEmprestimo); // Cria uma cópia da data de empréstimo
            dataDevolucao.setDate(dataDevolucao.getDate() + 7); // Adiciona 7 dias para a devolução
            const data_devolucao = dataDevolucao.toISOString().split('T')[0]; // Obtém a data de devolução formatada



            await db.tx(async t => {
                await t.none("INSERT INTO emprestimo (id_livro, matricula, data_emprestimo, data_devolucao, estado) VALUES ($1, $2, $3, $4, $5);", [id_livro, matricula, data_emprestimo, data_devolucao, false]);
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [false, id_livro]);
                await t.none("UPDATE aluno SET quantidade = $1 WHERE matricula = $2", [1, matricula]);
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
app.put("/emprestimo/devolucao", async (req, res) => {
    try {
        const matricula = req.body.matricula;
        const livroId = req.body.idLivro;
        const id_livro = parseInt(livroId);

        const emprestimo = await db.oneOrNone("SELECT * FROM emprestimo WHERE id_livro = $1 AND matricula = $2 AND estado = $3", [id_livro, matricula, false]);

        if (emprestimo) {
            await db.tx(async t => {
                await t.none("UPDATE livro SET estado = $1 WHERE id = $2", [true, id_livro]); // set livro true --> disponivel
                await t.none("UPDATE aluno SET quantidade = $1 WHERE matricula = $2", [0, matricula]);
                await t.none("UPDATE emprestimo SET estado = $1 WHERE id_livro = $2 AND matricula = $3", [true, id_livro, matricula]);
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

// consulta de um empréstimo:
app.get("/emprestimo/consulta/:matricula", async (req, res) => {
    try {
        const matr = req.params.matricula;
        const emprestimos = await db.any("SELECT id_emp, id_livro, matricula, data_emprestimo, data_devolucao, estado, CASE WHEN estado = true THEN 'Devolvido' WHEN estado = false THEN 'Em andamento' END AS estado FROM emprestimo WHERE matricula = $1", [matr]);

        if (emprestimos.length > 0) {
            res.status(200).json(emprestimos);
            console.log("Retornando empréstimo");
        } 
        
        else {res.status(404).send("Nenhum empréstimo encontrado para essa matrícula");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// consulta de todos os empréstimos: 
app.get("/emprestimo/consultas", async (req, res) => {
    try {
        const emprestimos = await db.any("SELECT id_emp, id_livro, matricula, data_emprestimo, data_devolucao, estado, CASE WHEN estado = true THEN 'Devolvido' WHEN estado = false THEN 'Em andamento' END AS estado FROM emprestimo ORDER BY data_emprestimo");
        //const emprestimos = await db.any("SELECT * FROM emprestimo ORDER BY data_emprestimo");
        
        if (emprestimos.length > 0) {
            res.status(200).json(emprestimos);
            console.log("Retornando todos os emprestimos");
        }
        
        else {res.status(404).send("Nenhum emprestimo encontrado");}
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// atualização de um empréstimo:
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

// exclusão de empréstimo:  
app.delete("/emprestimo/delete/:id", async (req, res) => {
    try {
        const idEmp = req.params.id;
        let id_emp = parseInt(idEmp);

        const emprestimo = await db.oneOrNone("SELECT * FROM emprestimo WHERE id_emp = $1", [id_emp]);

        if(emprestimo){
            if(emprestimo.estado === true){
                await db.oneOrNone("UPDATE livro SET estado = $1 WHERE id = $2", 
                [true, emprestimo.id_livro]);
                await db.oneOrNone("UPDATE aluno SET quantidade = $1, estado = $2 WHERE matricula = $3",
                [0, true, emprestimo.matricula]);
            }
            await db.none("DELETE FROM emprestimo WHERE id_emp = $1", [id_emp]);
            
            res.sendStatus(200);
        }
    } 
    
    catch (error) {
        console.log(error);
        res.status(400).send("Erro ao excluir o empréstimo. Verifique o ID informado.");
    }
});

/* --------------------------------------------------------------------------------------------------------------------------------------------------- */
//AUTOR: -- tudo okay

// consulta:
app.get("/autor/consulta/:id", async (req, res) => {
    try {
        const idAutor = req.params.id;
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

// consultas:
app.get("/autor/consultas", async (req, res) => {
    try {
        const autores = await db.any("SELECT * FROM autor ORDER BY nome");
        
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

// atualização:
app.put("/autor/atualizar", async (req, res) => {
    try {
        const idAutor = req.body.id;
        const novoNome = req.body.nome;
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

// cadastro:
app.post("/autor/cadastro", async (req, res) => {
    try {
        const nomeA = req.body.nome;
        const autorExistente = await db.oneOrNone("SELECT * FROM autor WHERE nome = $1", [nomeA]);

        if (autorExistente) {
            res.status(400).send("Autor já cadastrado");}
        
        else {
            await db.none("INSERT INTO autor (nome) VALUES ($1)", [nomeA]);
            res.sendStatus(200);
        }
    } 
    
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// deletando:
app.delete("/autor/delete", async (req, res) => {
    try {
        const idAutor = req.body.id;
        const id = parseInt(idAutor);
        
        await db.none("UPDATE livro SET id_autor = $1 WHERE id_autor = $2", [0, id]);
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
//EDITORA: -- tudo okay
// consulta:
app.get("/editora/consulta/:id", async (req, res) => {
    try {
        const idEditora = req.params.id;
        const id = parseInt(idEditora);
        const editora = await db.any("SELECT * FROM editora WHERE id = $1", [id]);
        
        if (editora && editora.length > 0) {
            res.status(200).json(editora);
            console.log("Retornando uma editora");
        } else {
            res.status(404).send("Editora não encontrada");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// consulta de todas as editoras:
app.get("/editora/consultas", async (req, res) => {
    try {
        const editoras = await db.any("SELECT * FROM editora ORDER BY nome");
        
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

// atualização:
app.put("/editora/atualizar", async (req, res) => {
    try {
        const idEditora = req.body.id;
        const novoNome = req.body.nome;
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

// cadastro:
app.post("/editora/cadastro", async (req, res) => {
    try {
        const nomeE = req.body.nome;
        const editoraExistente = await db.oneOrNone("SELECT * FROM editora WHERE nome = $1", [nomeE]);

        if (editoraExistente) {
            res.status(400).send("Editora já cadastrada");
        } else {
            await db.none("INSERT INTO editora (nome) VALUES ($1)", [nomeE]);
            res.sendStatus(200);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

// deletando:
app.delete("/editora/delete", async (req, res) => {
    try {
        const idEditora = req.body.id;
        const id = parseInt(idEditora);
        
        await db.none("UPDATE livro SET id_editora = $1 WHERE id_editora = $2", [0, id]);
        await db.none("DELETE FROM editora WHERE id = $1", [id]);
        
        console.log("Editora deletada");
        res.sendStatus(200);
    }
    
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});