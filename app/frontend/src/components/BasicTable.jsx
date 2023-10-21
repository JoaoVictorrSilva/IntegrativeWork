import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3010/";
axios.defaults.headers.common["Content-Type"] = "application/json;charset=utf-8";

export default function BasicTable() {

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const res = axios.get("/horarios/cc");
    res.then(query => {
      setData(query.data)
    }).catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
              <TableCell>Horários</TableCell>
                <TableCell align="center">Segunda</TableCell>
                <TableCell align="center">Terça</TableCell>
                <TableCell align="center">Quarta</TableCell>
                <TableCell align="center">Quinta</TableCell>
                <TableCell align="center">Sexta</TableCell>
                <TableCell align="center">Sábado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>        
        {data.map((row) => (
        <TableRow
          key={row.hora}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {row.hora}
          </TableCell>
          <TableCell align="center">{row.segunda}</TableCell>
          <TableCell align="center">{row.terca}</TableCell>
          <TableCell align="center">{row.quarta}</TableCell>
          <TableCell align="center">{row.quinta}</TableCell>
          <TableCell align="center">{row.sexta}</TableCell>
          <TableCell align="center">{row.sabado}</TableCell>
        </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}