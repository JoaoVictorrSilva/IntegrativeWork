import React from "react";
import axios from "axios";
import Header from "../Header";

import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "nome", headerName: "LIVRO", width: 180 },
  { field: "id_editora", headerName: "ID EDITORA", width: 180 },
  { field: "id_autor", headerName: "ID AUTOR", width: 180 },
  { field: "estado", headerName: "ESTADO", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function LivrosDisponiveis() {
    const [listaLivros, setListaLivros] = React.useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            const res = await axios.get("/consulta/livros/disponiveis");
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

export default LivrosDisponiveis;