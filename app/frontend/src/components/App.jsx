import React from "react";
import Header from "./Header";
import CadastroEmprestimo from "./Emprestimo/CadastroEmprestimo";
//import CadastroAutor from "./Autor/CadastroAutor";
//import CadastroEditora from "./Editora/CadastroEditora";
//import CadastroLivro from "./Livros/CadastroLivro";
//import CadastroAluno from "./Aluno/CadastroAluno";

function App( ) {

  return (
    <div>
      <Header/>
      <CadastroEmprestimo/>
      {/* <CadastroAutor/> -- OK -- */}
      {/* <CadastroEditora/> -- OK --*/}
      {/* <CadastroAluno/> -- OK -- */}
      {/* <CadastroLivro/> -- OK -- */}
    </div>
  );
}

export default App;