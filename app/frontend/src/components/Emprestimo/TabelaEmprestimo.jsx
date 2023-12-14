import React from "react";
import axios from "axios";
import Header from "../Header";

//style
import "./StyleTabelaEmprestimo.css";

import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const colunas = [
  { field: "id_emp", headerName: "ID Empréstimo", width: 120 },
  { field: "id_livro", headerName: "ID Livro", width: 90 },
  { field: "matricula", headerName: "Matrícula", width: 120 },
  { field: "data_emprestimo", headerName: "Data Empréstimo", width: 220 },
  { field: "data_devolucao", headerName: "Data Devolução", width: 220 },
  { field: "estado", headerName: "Estado", width: 180 },
];

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

function TabelaLivro() {
    const [listaEmp, setListaEmp] = React.useState([]);

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

    return (
        <Box>
            <Header/>
            <Stack className="text" spacing={2}>
                <Box style={{ height: "500px" }}>
                    <DataGrid rows={listaEmp} columns={colunas} getRowId={(row) => row.id_emp} />
                </Box>
            </Stack>
        </Box>
    );
}

export default TabelaLivro;