import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Buttons from "./Buttons";

import CadastroLivro from "./Livros/CadastroLivro";
import LivrosIndisponiveis from "./Livros/LivrosIndisponiveis";
import LivrosDisponiveis from "./Livros/LivrosDisponiveis";
import DeletarLivro from "./Livros/DeletarLivro";
import TabelaLivro from "./Livros/TabelaLivros";
import AtualizarLivro from "./Livros/AtualizarLivro";
import ConsultaLivro from "./Livros/ConsultaLivro";

import CadastroAluno from "./Aluno/CadastroAluno";
import AtualizarAluno from "./Aluno/AtualizarAluno";
import ConsultaAluno from "./Aluno/ConsultaALuno";
import DeletarAluno from "./Aluno/DeletarAluno";

import CadastroAutor from "./Autor/CadastroAutor";
import ConsultaAutor from "./Autor/ConsultaAutor";
import TabelaAutor from "./Autor/TabelaAutor";
import AtualizarAutor from "./Autor/AtualizarAutor";
import DeletarAutor from "./Autor/DeletarAutor";

import CadastroEditora from "./Editora/CadastroEditora";
import AtualizarEditora from "./Editora/AtualizarEditora";
import DeletarEditora from "./Editora/DeletarEditora";
import TabelaEditora from "./Editora/TabelaEditora";
import ConsultaEditora from "./Editora/ConsultaEditora";

function App( ) {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Buttons />} />
        <Route path="/aluno/cadastrar" element={<CadastroAluno/>} />
        <Route path="/aluno/atualizar" element={<AtualizarAluno/>} />
        <Route path="/aluno/consulta" element={<ConsultaAluno/>} />
        <Route path="aluno/delete" element={<DeletarAluno/>} />

        <Route path="/autor/atualizar" element={<AtualizarAutor />} />
        <Route path="/autor/cadastrar" element={<CadastroAutor />} />
        <Route path="/autor/consulta" element={<ConsultaAutor />} />
        <Route path="/autor/delete" element={<DeletarAutor />} />
        <Route path="/autor/tabela" element={<TabelaAutor />} />

        <Route path="/editora/atualizar" element={<AtualizarEditora/>}/>
        <Route path="/editora/cadastrar" element={<CadastroEditora/>}/>
        <Route path="/editora/consulta" element={<ConsultaEditora/>}/>
        <Route path="/editora/delete" element={<DeletarEditora/>}/>
        <Route path="/editora/tabela" element={<TabelaEditora/>}/>

        <Route path="/livro/atualizar" element={<AtualizarLivro/>}/>
        <Route path="/livro/cadastrar" element={<CadastroLivro/>}/>
        <Route path="/livro/consulta" element={<ConsultaLivro/>}/>
        <Route path="/livro/delete" element={<DeletarLivro/>}/>
        <Route path="/livro/disponiveis" element={<LivrosDisponiveis/>}/>
        <Route path="/livro/indisponiveis" element={<LivrosIndisponiveis/>}/>
        <Route path="/livro/tabela" element={<TabelaLivro/>}/>

      </Routes>
    </Router>
  );
}

export default App;