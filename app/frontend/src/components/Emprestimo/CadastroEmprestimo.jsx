import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "idE", headerName: "ID Empréstimo", width: 90 },
    { field: "idL", headerName: "ID Livro", width: 180 },
    { field: "matr", headerName: "Matrícula", width: 180 },
    { field: "dataE", headerName: "Data Empréstimo", width: 180 },
    { field: "dataD", headerName: "Data Devolução", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function CadastroLivro() {
    const [idL, setIdL] = React.useState("");
    const [matr, setMatr] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaEmpr, setListaEmpr] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/emprestimo/consutas");
            setListaEmpr(res.data);
            console.log(res.data);
        } catch (error) {
          setListaEmpr([]);
        }
    }

    function clearForm() {
        setIdL("");
        setMatr("");
    }

    function handleCancelClick() {
        if (idL !== "" || matr !== "") {
            setMessageText("Cadastro do empréstimo cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (idL !== "" && matr !== "") {
            try {
                await axios.post("/emprestimo/cadastro", {
                    livroId: idL,
                    matricula: matr,
                });
                console.log(`Nome: ${idL} - Matricula: ${matr}`);
                setMessageText("Empréstimo cadastrado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha no cadastro do empréstimo!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                await getData();
            }
        } else {
            setMessageText("Dados do empréstimo inválidos!");
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
                        id="id-input"
                        label="ID Livro"
                        size="small"
                        onChange={(e) => setIdL(e.target.value)}
                        value={idL}
                    />
                    <TextField
                        required
                        id="matr-input"
                        label="Matrícula"
                        size="small"
                        onChange={(e) => setMatr(e.target.value)}
                        value={matr}
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
                    <DataGrid rows={ListaEmpr} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default CadastroLivro;