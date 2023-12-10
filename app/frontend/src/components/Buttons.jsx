import React, { useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Container, Menu, MenuItem } from "@mui/material";
import Header from "./Header";

function Buttons() {
  const [alunoAnchorEl, setAlunoAnchorEl] = useState(null);
  const handleAlunoMenuClick = (event) => {
    setAlunoAnchorEl(event.currentTarget);
  };
  const handleAlunoMenuClose = () => {
    setAlunoAnchorEl(null);
  };

  const [autorAnchorEl, setAutorAnchorEl] = useState(null);
  const handleAutorMenuClick = (event) => {
    setAutorAnchorEl(event.currentTarget);
  };
  const handleAutorMenuClose = () => {
    setAutorAnchorEl(null);
  };

  const [editoraAnchorEl, setEditoraAnchorEl] = useState(null);
  const handleEditoraMenuClick = (event) => {
    setEditoraAnchorEl(event.currentTarget);
  };
  const handleEditoraMenuClose = () => {
    setEditoraAnchorEl(null);
  };

  const [emprestimoAnchorEl, setEmprestimoAnchorEl] = useState(null);
  const handleEmprestimoMenuClick = (event) => {
    setEmprestimoAnchorEl(event.currentTarget);
  };
  const handleEmprestimoMenuClose = () => {
    setEmprestimoAnchorEl(null);
  };

  const [livroAnchorEl, setLivroAnchorEl] = useState(null);
  const handleLivroMenuClick = (event) => {
    setLivroAnchorEl(event.currentTarget);
  };
  const handleLivroMenuClose = () => {
    setLivroAnchorEl(null);
  };

  return (
    <div>
      <Header />
      <Container maxWidth="md">
        <nav>
          <Button
            aria-controls="aluno-menu"
            aria-haspopup="true"
            onClick={handleAlunoMenuClick}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Aluno
          </Button>
          <Menu
            id="aluno-menu"
            anchorEl={alunoAnchorEl}
            open={Boolean(alunoAnchorEl)}
            onClose={handleAlunoMenuClose}
          >
            <MenuItem component={Link} to="/aluno/cadastrar" onClick={handleAlunoMenuClose}>
              Cadastrar
             </MenuItem>
             <MenuItem component={Link} to="/aluno/atualizar" onClick={handleAlunoMenuClose}>
              Atualizar
             </MenuItem>
             <MenuItem component={Link} to="/aluno/consulta" onClick={handleAlunoMenuClose}>
              Pesquisar
             </MenuItem>
             <MenuItem component={Link} to="/aluno/delete" onClick={handleAlunoMenuClose}>
              Deletar
             </MenuItem>
        </Menu>

          <Button
            aria-controls="autor-menu"
            aria-haspopup="true"
            onClick={handleAutorMenuClick}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Autor
          </Button>
          <Menu
            id="autor-menu"
            anchorEl={autorAnchorEl}
            open={Boolean(autorAnchorEl)}
            onClose={handleAutorMenuClose}
          >
            <MenuItem component={Link} to="/autor/atualizar" onClick={handleAutorMenuClose}>
              Atualizar
             </MenuItem>
             <MenuItem component={Link} to="/autor/cadastrar" onClick={handleAutorMenuClose}>
              Cadastrar
             </MenuItem>
             <MenuItem component={Link} to="/autor/consulta" onClick={handleAutorMenuClose}>
              Consulta
             </MenuItem>
             <MenuItem component={Link} to="/autor/delete" onClick={handleAutorMenuClose}>
              Deletar
             </MenuItem>
             <MenuItem component={Link} to="/autor/tabela" onClick={handleAutorMenuClose}>
              Tabela
             </MenuItem>
        </Menu>

          <Button
            aria-controls="editora-menu"
            aria-haspopup="true"
            onClick={handleEditoraMenuClick}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Editora
          </Button>
          <Menu
            id="editora-menu"
            anchorEl={editoraAnchorEl}
            open={Boolean(editoraAnchorEl)}
            onClose={handleEditoraMenuClose}
          >
            <MenuItem component={Link} to="/editora/atualizar" onClick={handleEditoraMenuClose}>
              Atualizar
            </MenuItem>
            <MenuItem component={Link} to="/editora/cadastrar" onClick={handleEditoraMenuClose}>
              Cadastrar
            </MenuItem>
            <MenuItem component={Link} to="/editora/consulta" onClick={handleEditoraMenuClose}>
              Consulta
            </MenuItem>
            <MenuItem component={Link} to="/editora/delete" onClick={handleEditoraMenuClose}>
              Deletar
            </MenuItem>
            <MenuItem component={Link} to="/editora/tabela" onClick={handleEditoraMenuClose}>
              Tabela
            </MenuItem>
        </Menu>

        <Button
            aria-controls="emprestimo-menu"
            aria-haspopup="true"
            onClick={handleEmprestimoMenuClick}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Empréstimo
          </Button>
          <Menu
            id="emprestimo-menu"
            anchorEl={emprestimoAnchorEl}
            open={Boolean(emprestimoAnchorEl)}
            onClose={handleEmprestimoMenuClose}
          >
            <MenuItem component={Link} to="/emprestimo/atualizar" onClick={handleEmprestimoMenuClose}>
              Atualizar
            </MenuItem>
            <MenuItem component={Link} to="/emprestimo/cadastrar" onClick={handleEmprestimoMenuClose}>
              Cadastrar
            </MenuItem>
            <MenuItem component={Link} to="/emprestimo/consulta" onClick={handleEmprestimoMenuClose}>
              Consulta
            </MenuItem>
            <MenuItem component={Link} to="/emprestimo/delete" onClick={handleEmprestimoMenuClose}>
              Deletar
            </MenuItem>
            <MenuItem component={Link} to="/emprestimo/tabela" onClick={handleEmprestimoMenuClose}>
              Tabela
            </MenuItem>
          </Menu>

          <Button
            aria-controls="livro-menu"
            aria-haspopup="true"
            onClick={handleLivroMenuClick}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
          >
            Livro
          </Button>
          <Menu
            id="livro-menu"
            anchorEl={livroAnchorEl}
            open={Boolean(livroAnchorEl)}
            onClose={handleLivroMenuClose}
          >
            <MenuItem component={Link} to="/livro/atualizar" onClick={handleLivroMenuClose}>
              Atualizar
            </MenuItem>
            <MenuItem component={Link} to="/livro/cadastrar" onClick={handleLivroMenuClose}>
              Cadastrar
            </MenuItem>
            <MenuItem component={Link} to="/livro/consulta" onClick={handleLivroMenuClose}>
              Consulta
            </MenuItem>
            <MenuItem component={Link} to="/livro/delete" onClick={handleLivroMenuClose}>
              Deletar
            </MenuItem>
            <MenuItem component={Link} to="/livro/disponiveis" onClick={handleLivroMenuClose}>
              Tabela Disponíveis
            </MenuItem>
            <MenuItem component={Link} to="/livro/indisponiveis" onClick={handleLivroMenuClose}>
              Tabela Indisponíveis
            </MenuItem>
            <MenuItem component={Link} to="/livro/tabela" onClick={handleLivroMenuClose}>
              Tabela
            </MenuItem>
          </Menu>

        </nav>
      </Container>
    </div>
  );
}

export default Buttons;