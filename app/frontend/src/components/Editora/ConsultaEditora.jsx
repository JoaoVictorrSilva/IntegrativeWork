import React from "react";
import axios from "axios";
import Header from "../Header";

//style
import "./StyleConsultaEditora.css";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID Editora", width: 90 },
    { field: "nome", headerName: "Nome", width: 180 },
  ];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function ConsultaEditora() {
    
    const [id, setId] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaEditoras, setListaEditoras] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/editora/consultas");
            setListaEditoras(res.data);
            console.log(res.data);
        } catch (error) {
            setListaEditoras([]);
        }
    }

    function clearForm() {
        setId("");
    }

    function handleCancelClick() {
        if (id !== "") {
            setMessageText("Consulta da editora cancelada!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
    }

    async function handleSubmit() {
        if (id !== "") {
            try {
                const res = await axios.get(`/editora/consulta/${id}`);
                const editorasConsultadas = res.data ? res.data.map((editora, index) => ({ ...editora, id: index + 1 })) : [];
                if (editorasConsultadas.length > 0) {
                    setListaEditoras(editorasConsultadas);
                    setMessageText("Editora retornada com sucesso!");
                    setMessageSeverity("success");
                    clearForm();
                } else {
                    setListaEditoras([]);
                    setMessageText("Editora não encontrada!");
                    setMessageSeverity("info");
                }
            } catch (error) {
                console.log(error);
                setMessageText("Falha no retorno da editora!");
                setMessageSeverity("error");
            } finally {
                setOpenMessage(true);
                //await getData();
            }
        } else {
            setMessageText("Dados da editora inválidos!");
            setMessageSeverity("warning");
            setOpenMessage(true);
            await getData();
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
                        id="id-input"
                        label="Id Editora"
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
                    <DataGrid rows={ListaEditoras} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default ConsultaEditora;