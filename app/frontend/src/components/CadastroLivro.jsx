import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nome", headerName: "NOME", width: 180 },
    { field: "editora", headerName: "EMAIL", width: 180 },
    { field: "estado", headerName: "ESTADO", width: 180 },
];

function CadastroLivro() {
    const [nome, setNome] = React.useState("");
    const [editora, setEditora] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [listaLivros, setListaLivros] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/livros");
            setListaLivros(res.data);
            console.log(res.data);
        } catch (error) {
          setListaLivros([]);
        }
    }

    function clearForm() {
        setNome("");
        setEditora("");
    }

    function handleCancelClick() {
        if (nome !== "" || editora !== "") {
            setMessageText("Cadastro de livro cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (nome !== "" && editora !== "") {
            try {
                await axios.post("/livro", {
                    nome: nome,
                    editora: editora,
                });
                console.log(`Nome: ${nome} - Editora: ${editora}`);
                setMessageText("Livro cadastrado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha no cadastro do livro!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                await getData();
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
            <Stack spacing={2}>
                <Stack spacing={2}>
                    <TextField
                        required
                        id="nome-input"
                        label="Nome"
                        size="small"
                        onChange={(e) => setNome(e.target.value)}
                        value={nome}
                    />
                    <TextField
                        required
                        id="editora-input"
                        label="Editora"
                        size="small"
                        onChange={(e) => setEditora(e.target.value)}
                        value={editora}
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
                    <DataGrid rows={listaLivros} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default CadastroLivro;