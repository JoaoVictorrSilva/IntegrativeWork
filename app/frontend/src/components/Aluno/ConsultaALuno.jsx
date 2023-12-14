import React from "react";
import axios from "axios";
import Header from "../Header";

//style
import "./StyleConsultaAluno.css";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "nome", headerName: "Nome", width: 180 },
    { field: "matricula", headerName: "Matrícula", width: 180 },
    { field: "estado", headerName: "Estado", width: 180 },
    { field: "quantidade", headerName: "Quantidade", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function ConsultaAluno() {
    
    const [matr, setMatr] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaAluno, setListaAluno] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/aluno/consultas");
            const alunosComId = res.data.map((aluno, index) => ({ ...aluno, id: index + 1 }));
            setListaAluno(alunosComId);
            console.log(alunosComId);
        } catch (error) {
            setListaAluno([]);
        }
    }

    function clearForm() {
        setMatr("");
    }

    function handleCancelClick() {
        if (matr !== "") {
            setMessageText("Consulta do aluno cancelada!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
        getData();
    }

    async function handleSubmit() {
      if (matr !== "") {
          try {
              const res = await axios.get(`/aluno/consulta/${matr}`);
              const alunos = res.data ? res.data.map((alunos, index) => ({ ...alunos, id: index + 1 })) : [];
              if (alunos.length > 0) {
                  setListaAluno(alunos);
                  setMessageText("Aluno retornado com sucesso!");
                  setMessageSeverity("success");
                  clearForm();
              } else {
                  setMessageText("Aluno não encontrado!");
                  setMessageSeverity("info");
              }
          } catch (error) {
              console.log(error);
              setMessageText("Falha no retorno do aluno!");
              setMessageSeverity("error");
          } finally {
              setOpenMessage(true);
          }
      } else {
          setMessageText("Dados do aluno inválidos!");
          setMessageSeverity("warning");
          setOpenMessage(true);
          getData();
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
                <DataGrid rows={ListaAluno} columns={colunas} getRowId={(row) => row.matricula} />
                </Box>
            </Stack>
        </Box>
    );
}

export default ConsultaAluno;