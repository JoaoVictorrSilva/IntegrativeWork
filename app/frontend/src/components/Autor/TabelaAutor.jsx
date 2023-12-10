import React from "react";
import axios from "axios";

import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
  { field: "id", headerName: "ID Autor", width: 90 },
  { field: "nome", headerName: "Nome", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function TabelaAutor() {
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

    return (
        <Box>
            <Stack spacing={2}>
                <Box style={{ height: "500px" }}>
                    <DataGrid rows={ListaAutor} columns={colunas} />
                </Box>
            </Stack>
        </Box>
    );
}

export default TabelaAutor;