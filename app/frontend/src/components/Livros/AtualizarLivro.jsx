import React from "react";
import axios from "axios";
import Header from "../Header";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
  { field: "id", headerName: "ID Livro", width: 90 },
  { field: "nome", headerName: "Nome", width: 180 },
  { field: "id_editora", headerName: "ID Editora", width: 180 },
  { field: "id_autor", headerName: "ID Autor", width: 180 },
  { field: "estado", headerName: "Estado", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function AtualizarLivro() {
    const [nomeL, setNomeL] = React.useState("");
    const [attNomeL, setAttNomeL] = React.useState("");
    const [attAutor, setAttAutor] = React.useState("");
    const [attEditor, setAttEditor] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaLivros, setListaLivros] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/consulta/livros"); //arrumar
            setListaLivros(res.data);
            console.log(res.data);
        } catch (error) {
            setListaLivros([]);
        }
    }

    function clearForm() {
      setNomeL("");
      setAttNomeL("");
      setAttAutor("");
      setAttEditor("");
    }

    function handleCancelClick() {
        if (nomeL !== "" || attNomeL !== "" || attAutor !== "" || attEditor !== "") {
            setMessageText("Atualização do livro cancelada!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (nomeL !== "" && attNomeL !== "" && attAutor !== "" && attEditor !== "") {
            try {
                await axios.put("/livro/atualizar", {              
                    nome: nomeL,
                    novoNome: attNomeL,
                    novaEditora: attEditor, //attEditor e attAutor podem ser nulos
                    novoAutor: attAutor,
                });
                const res = await axios.get(`/livro/consulta/${attNomeL}`);
                const livrosConsultados = res.data ? res.data.map((livro, index) => ({ ...livro, id: index + 1 })) : [];
                if (livrosConsultados.length > 0) {
                  setListaLivros(livrosConsultados);
                  setMessageText("Livros retornados com sucesso!");
                  setMessageSeverity("success");
                  clearForm();
              } else {
                  setListaLivros([]);
                }
                console.log(`Nome: ${nomeL} - Novo Nome: ${attNomeL}`);
                setMessageText("Livro atualizado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha ao atualizar o livro!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
            }
        } else {
            setMessageText("Dados do livro inválidos!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
    }

    function handleCloseMessage(_, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpenMessage(false);
    }

    return (
        <Box>
            <Header/>
            <Stack spacing={2}>
                <Stack spacing={2}>
                    <TextField
                        required
                        id="nome-input"
                        label="Nome"
                        size="small"
                        onChange={(e) => setNomeL(e.target.value)}
                        value={nomeL}
                    />  
                    <TextField
                        required
                        id="nome-input"
                        label="Novo Nome"
                        size="small"
                        onChange={(e) => setAttNomeL(e.target.value)}
                        value={attNomeL}
                    />
                    <TextField
                        required
                        id="editora-input"
                        label="ID Nova Editora"
                        size="small"
                        onChange={(e) => setAttEditor(e.target.value)}
                        value={attEditor}
                    />
                    <TextField
                        required
                        id="autor-input"
                        label="ID Novo Autor"
                        size="small"
                        onChange={(e) => setAttAutor(e.target.value)}
                        value={attAutor}
                    />             
                </Stack>
                <Stack direction="row" spacing={3}>
                    <Button
                        variant="contained"
                        style={{
                            maxWidth: "100px",
                            minWidth: "100px",
                        }}
                        onClick={handleSubmit}
                        type="submit"
                        color="primary"
                    >
                        Enviar
                    </Button>
                    <Button
                        variant="outlined"
                        style={{
                            maxWidth: "100px",
                            minWidth: "100px",
                        }}
                        onClick={handleCancelClick}
                        color="error"
                    >
                        Cancelar
                    </Button>
                </Stack>

                <Snackbar
                    open={openMessage}
                    autoHideDuration={6000}
                    onClose={handleCloseMessage}
                >
                    <Alert
                        severity={messageSeverity}
                        onClose={handleCloseMessage}
                    >
                        {messageText}
                    </Alert>
                </Snackbar>
                <Box style={{ height: "500px" }}>
                    <DataGrid rows={ListaLivros} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default AtualizarLivro;