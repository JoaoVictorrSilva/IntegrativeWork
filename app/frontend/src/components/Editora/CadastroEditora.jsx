import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID Editora", width: 90 },
    { field: "nome", headerName: "Nome", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function CadastroEditora() {
    const [nomeE, setNome] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaEditora, setListaEditora] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/editora/consultas"); //
            setListaEditora(res.data);
            console.log(res.data);
        } catch (error) {
            setListaEditora([]);
        }
    }

    function clearForm() {
        setNome("");
    }

    function handleCancelClick() {
        if (nomeE !== "") {
            setMessageText("Cadastro da editora cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (nomeE !== "") {
            try {
                await axios.post("/editora/cadastro", {
                    nome: nomeE,
                });
                console.log(`Nome: ${nomeE}`);
                setMessageText("Editora cadastrado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha no cadastro da Editora!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                await getData();
            }
        } else {
            setMessageText("Dados da editora inválidos!");
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
                        value={nomeE}
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
                    <DataGrid rows={ListaEditora} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default CadastroEditora;