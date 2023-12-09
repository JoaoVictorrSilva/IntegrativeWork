import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID Livro", width: 90 },
    { field: "nome", headerName: "Nome", width: 180 },
    { field: "idEditora", headerName: "ID Editora", width: 180 },
    { field: "idAutor", headerName: "ID Autor", width: 180 },
    { field: "estado", headerName: "Estado", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function ConsultaLivro() {
    const [nome, setNome] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaLivros, setListaLivros] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/consulta/livro");
            setListaLivros(res.data);
            console.log(res.data);
        } catch (error) {
            setListaLivros([]);
        }
    }

    function clearForm() {
        setNome("");
    }

    function handleCancelClick() {
        if (nome !== "") {
            setMessageText("Consulta do livro cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (nome !== "") {
            try {
                await axios.get("/consulta/livro", {
                    nome: nome,
                });
                console.log(`Nome: ${nome}`);
                setMessageText("Livro retornado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha no retorno do livro!");
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

export default ConsultaLivro;