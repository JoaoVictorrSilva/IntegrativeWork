import React from "react";
import axios from "axios";
import Header from "../Header";

//style
import "./StyleDeletarEmprestimo.css";

import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id_emp", headerName: "ID Empréstimo", width: 90 },
    { field: "id_livro", headerName: "ID Livro", width: 180 },
    { field: "matricula", headerName: "Matrícula", width: 180 },
    { field: "estado", headerName: "Data Devolução", width: 180 },
    { field: "data_emprestimo", headerName: "Data Empréstimo", width: 180 },
    { field: "data_devolucao", headerName: "Data Devolução", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function DeletarEmprestimo() {
    const [id, setId] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");

    const [ListaEmpr, setListaEmp] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
      try {
          const res = await axios.get("/emprestimo/consultas");
          const empComId = res.data.map((emp, index) => ({ ...emp, id: index + 1 }));
          setListaEmp(empComId);
          console.log(empComId);
      } catch (error) {
          setListaEmp([]);
      }
  }

    function clearForm() {
        setId("");
    }

    function handleCancelClick() {
        if (setId !== "") {
            setMessageText("Delete do empréstimo cancelado!");
            setMessageSeverity("warning");
            setOpenMessage(true);
        }
        clearForm();
        getData();
    }

    async function handleSubmit() {
      if (id !== "") {
          try {
              const res = await axios.delete(`/emprestimo/delete/${id}`);
              if (res) {
                  setListaEmp([]);
                  setMessageText("Empréstimo deletado com sucesso!");
                  setMessageSeverity("success");
                  clearForm();
              } else {
                  setListaEmp([]);
                  setMessageText("Empréstimo não encontrado!");
                  setMessageSeverity("info");
              }
          } catch (error) {
              console.log(error);
              setMessageText("Falha para deletar o empréstimo!");
              setMessageSeverity("error");
          } finally {
              setOpenMessage(true);
              //await getData();
          }
      } else {
          setMessageText("Dados do empréstimo inválidos!");
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
                        label="Id empréstimo"
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
                  <DataGrid rows={ListaEmpr} columns={colunas} getRowId={(row) => row.id_emp} />
                </Box>
            </Stack>
        </Box>
    );
}

export default DeletarEmprestimo;