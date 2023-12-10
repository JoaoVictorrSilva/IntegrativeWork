import React from "react";
import axios from "axios";
import Header from "../Header";

import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
  { field: "id_emp", headerName: "ID Empréstimo", width: 180 },
  { field: "id_livro", headerName: "ID Livro", width: 180 },
  { field: "matricula", headerName: "Matrícula", width: 180 },
  { field: "data_emprestimo", headerName: "Data Empréstimo", width: 180 },
  { field: "data_devolucao", headerName: "Data Devolução", width: 180 },
  { field: "estado", headerName: "Estado", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function TabelaLivro() {
    const [listaLivros, setListaLivros] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/emprestimo/consultas");
            setListaLivros(res.data);
            console.log(res.data);
        } catch (error) {
          setListaLivros([]);
        }
    }

    return (
        <Box>
            <Header/>
            <Stack spacing={2}>
                <Box style={{ height: "500px" }}>
                    <DataGrid rows={listaLivros} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default TabelaLivro;