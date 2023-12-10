import React from "react";
import axios from "axios";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "nome", headerName: "Nome", width: 90 },
    { field: "matricula", headerName: "Matrícula", width: 180 },
    { field: "estado", headerName: "Estado", width: 180 },
    { field: "quantidade", headerName: "Quantidade", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function ConsultaAluno() {
    const [matrA, setMatr] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaAlunos, setListaAlunos] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/aluno/"); //arrumar
            setListaAlunos(res.data);
            console.log(res.data);
        } catch (error) {
            setListaAlunos([]);
        }
    }

    function clearForm() {
        setMatr("");
    }

    function handleCancelClick() {
        if (matrA !== "") {
            setMessageText("Consulta do aluno cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
      if (matrA !== "") {
          try {
              const res = await axios.get(`/aluno/consulta/${matrA}`);
              const alunoConsultado = res.data ? { ...res.data, id: 1 } : null;
              setListaAlunos(alunoConsultado ? [alunoConsultado] : []);
              setMessageText("Aluno retornado com sucesso!");
              setMessageSeverity("success");
              clearForm();
          } catch (error) {
              console.log(error);
              setMessageText("Falha para encontrar o aluno!");
              setMessageSeverity("error");
          } finally {
              setOpenMessage(true);
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
            <Stack spacing={2}>
                <Stack spacing={2}>
                    <TextField
                        required
                        id="matr-input"
                        label="Matrícula"
                        size="small"
                        onChange={(e) => setMatr(e.target.value)}
                        value={matrA}
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
                    <DataGrid rows={ListaAlunos} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default ConsultaAluno;