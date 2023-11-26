import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";

function CadastroLivro() {
    const [nome, setNome] = React.useState("");
    const [senha, setSenha] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    function clearForm() {
        setNome("");
        setSenha("");
    }

    function handleCancelClick() {
        if (nome !== "" || senha !== "") {
            setMessageText("Login cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (nome !== "" && senha !== "") {
            try {
                await axios.post("/login", {
                    nome: nome,
                    editora: senha,
                });
                console.log(`Login: ${nome}`);
                setMessageText("Login feito com sucesso!");
                setMessageSeverity("success");
                clearForm();
            } catch (error) {
                console.log(error);
                setMessageText("Falha no login!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                //await getData();
            }
        } else {
            setMessageText("Dados do login inválidos!");
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
                        id="senha-input"
                        label="Senha"
                        size="small"
                        onChange={(e) => setSenha(e.target.value)}
                        value={senha}
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
                        Entrar
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
            </Stack>
        </Box>
    );
}

export default CadastroLivro;