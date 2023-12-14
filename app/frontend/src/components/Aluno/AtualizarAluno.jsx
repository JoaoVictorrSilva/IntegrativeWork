import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../Header";

//style
import "./StyleAtualizarAluno.css";

const colunas = [
    { field: "nome", headerName: "Nome", width: 90 },
    { field: "matricula", headerName: "Matrícula", width: 180 },
    { field: "estado", headerName: "Estado", width: 180 },
    { field: "quantidade", headerName: "Quantidade", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function AtualizarAluno() {
    const [matrA, setMatr] = React.useState("");
    const [AttNome, setAttNome] = React.useState("");
    const [AttQuant, setAttQuant] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaAlunos, setListaAlunos] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/aluno/consultas");
            const alunosComId = res.data.map((aluno, index) => ({ ...aluno, id: index + 1 }));
            setListaAlunos(alunosComId);
            console.log(alunosComId);
        } catch (error) {
            setListaAlunos([]);
        }
    }

    function clearForm() {
      setMatr("");
      setAttNome("");
      setAttQuant("");
    }

    function handleCancelClick() {
        if (AttNome !== "" || matrA !== "" || AttQuant !== "") {
            setMessageText("Atualização do aluno cancelada!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (AttNome !== "" && matrA !== "" && AttQuant !== "") {
            try {
                await axios.put("/aluno/atualizar", {              
                    matricula: matrA,
                    nome: AttNome,
                    quantidade: AttQuant,
                });
                console.log(`Nome: ${AttNome} - Matricula: ${matrA}`);
                setMessageText("Aluno atualizado com sucesso!");
                setMessageSeverity("success");
                clearForm(); // limpa o formulário apenas se cadastrado com sucesso
            } catch (error) {
                console.log(error);
                setMessageText("Falha ao atualizar o aluno!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                await getData();
            }
        } else {
            setMessageText("Dados do aluno inválidos!");
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
            <Stack className="text" spacing={2}>
                <Stack spacing={2}>
                    <TextField
                        required
                        id="matr-input"
                        label="Matrícula"
                        size="small"
                        onChange={(e) => setMatr(e.target.value)}
                        value={matrA}
                    />  
                    <TextField
                        required
                        id="nome-input"
                        label="Novo Nome"
                        size="small"
                        onChange={(e) => setAttNome(e.target.value)}
                        value={AttNome}
                    />
                    <TextField
                        required
                        id="quant-input"
                        label="Nova Quantidade (0/1)"
                        size="small"
                        onChange={(e) => setAttQuant(e.target.value)}
                        value={AttQuant}
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
                        color="success"
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
                    <DataGrid rows={ListaAlunos} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default AtualizarAluno;