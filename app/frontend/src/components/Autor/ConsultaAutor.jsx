import React from "react";
import axios from "axios";
import Header from "../Header";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID Autor", width: 90 },
    { field: "nome", headerName: "Nome", width: 180 },
  ];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function ConsultaAutor() {
    
    const [id, setId] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaAutor, setListaAutor] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/autor/consultas");
            setListaAutor(res.data);
            console.log(res.data);
        } catch (error) {
            setListaAutor([]);
        }
    }

    function clearForm() {
        setId("");
    }

    function handleCancelClick() {
        if (id !== "") {
            setMessageText("Consulta do autor cancelada!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
      if (id !== "") {
          try {
              const res = await axios.get(`/autor/consulta/${id}`);
              const autoresConsultados = res.data ? res.data.map((autor, index) => ({ ...autor, id: index + 1 })) : [];
              if (autoresConsultados.length > 0) {
                  setListaAutor(autoresConsultados);
                  setMessageText("Autor retornado com sucesso!");
                  setMessageSeverity("success");
                  clearForm();
              } else {
                  setMessageText("Autor não encontrado!");
                  setMessageSeverity("info");
              }
          } catch (error) {
              console.log(error);
              setMessageText("Falha no retorno do autor!");
              setMessageSeverity("error");
          } finally {
              setOpenMessage(true);
          }
      } else {
          setMessageText("Dados do autor inválidos!");
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
                        id="id-input"
                        label="Id Autor"
                        size="small"
                        onChange={(e) => setId(e.target.value)}
                        value={id}
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
                    <DataGrid rows={ListaAutor} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default ConsultaAutor;