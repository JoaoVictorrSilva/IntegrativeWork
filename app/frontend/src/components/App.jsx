import React from "react";

import {BrowserRouter as Router, Route} from "react-router-dom";
import { Switch } from 'react-router-dom';

import Navbar from "./Navbar";
import Header from "./Header";
import Home from "../pages/Home";
import CadastroLivro from "../pages/CadastroLivro";
import CadastroAluno from "../pages/CadastroAluno";
import TabelaLivros from "../pages/TabelaLivros";

function App( ) {

  return (
    <Router>
      <Header/>
        <Navbar/>
        <Switch>
          <Route exact path="/"><Home/></Route>
          <Route path="/cadastro/livro"><CadastroLivro/></Route>
          <Route path="/cadastro/aluno"><CadastroAluno/></Route>
          <Route path="/tabela/livros"><TabelaLivros/></Route>
        </Switch>
    </Router>
  );
}

export default App;