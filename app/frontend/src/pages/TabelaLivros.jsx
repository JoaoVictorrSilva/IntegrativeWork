import React from "react";
import axios from "axios";

import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nome", headerName: "LIVRO", width: 180 },
    { field: "editora", headerName: "EDITORA", width: 180 },
    { field: "estado", headerName: "ESTADO", width: 180 },
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
            const res = await axios.get("/tabela/livros");
            setListaLivros(res.data);
            console.log(res.data);
        } catch (error) {
          setListaLivros([]);
        }
    }

    return (
        <Box>
            <Stack spacing={2}>
                <Box style={{ height: "500px" }}>
                    <DataGrid rows={listaLivros} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default TabelaLivro;