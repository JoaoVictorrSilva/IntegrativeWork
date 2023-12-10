import React from "react";
import Header from "./Header";

import ButtonLivro from "./Buttons/ButtonLivro";
import ButtonAluno from "./Buttons/ButtonAluno";
import ButtonAutor from "./Buttons/ButtonAutor";
import ButtonEditora from "./Buttons/ButtonEditora";
import ButtonEmprestimo from "./Buttons/ButtonEmprestimo";

//import CadastroLivro from "./Livros/CadastroLivro";
//import LivrosIndisponiveis from "./Livros/LivrosIndisponiveis";
//import LivrosDisponiveis from "./Livros/LivrosDisponiveis";
//import DeletarLivro from "./Livros/DeletarLivro";
//import TabelaLivro from "./Livros/TabelaLivros";
//import AtualizarLivro from "./Livros/AtualizarLivro";
//import ConsultaLivro from "./Livros/ConsultaLivro";

//import CadastroAluno from "./Aluno/CadastroAluno";
//import AtualizarAluno from "./Aluno/AtualizarAluno";
//import ConsultaAluno from "./Aluno/ConsultaALuno";
//import DeletarAluno from "./Aluno/DeletarAluno";

//import CadastroEmprestimo from "./Emprestimo/CadastroEmprestimo";

//import CadastroAutor from "./Autor/CadastroAutor";
//import ConsultaAutor from "./Autor/ConsultaAutor";
//import TabelaAutor from "./Autor/TabelaAutor";
//import AtualizarAutor from "./Autor/AtualizarAutor";
//import DeletarAutor from "./Autor/DeletarAutor";

//import CadastroEditora from "./Editora/CadastroEditora";
//import AtualizarEditora from "./Editora/AtualizarEditora";
//import DeletarEditora from "./Editora/DeletarEditora";
//import TabelaEditora from "./Editora/TabelaEditora";
//import ConsultaEditora from "./Editora/ConsultaEditora";

function App( ) {

  return (
    <div style={{textAlign: 'center'}}>
      <Header/>
      <div className="main">
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ marginBottom: '10px' }}><ButtonAluno className='ButtonBasic'/></li>
        <li style={{ marginBottom: '10px' }}><ButtonAutor className='ButtonBasic'/></li>
        <li style={{ marginBottom: '10px' }}><ButtonLivro className='ButtonBasic'/></li>
        <li style={{ marginBottom: '10px' }}><ButtonEditora className='ButtonBasic'/></li>
        <li style={{ marginBottom: '10px' }}><ButtonEmprestimo className='ButtonBasic'/></li>
      </ul>
      </div>

      {/* <CadastroAluno/> */}
      {/* <AtualizarAluno /> */}
      {/* <ConsultaAluno/> -- OK só não aparece os dados do aluno pesquisado na tabela */}
      {/* <DeletarAluno/> */}

      {/* <CadastroLivro/> */}
      {/* <ConsultaLivro/> */}
      {/* <AtualizarLivro/> */}
      {/* <DeletarLivro/> */}
      {/* <TabelaLivro/> */}
      {/* <LivrosDisponiveis/> */}
      {/* <LivrosIndisponiveis/> */}

      {/* <CadastroEmprestimo/> */}

      {/* <CadastroAutor/> */}
      {/* <ConsultaAutor/> */}
      {/* <TabelaAutor/> */}
      {/* <AtualizarAutor/> */}
      {/* <DeletarAutor/> */}

      {/* <CadastroEditora/> */}
      {/* <AtualizarEditora/> */}
      {/* <DeletarEditora/> */}
      {/* <TabelaEditora/> */}
      {/* <ConsultaEditora/> */}
    </div>
  );
}

export default App;