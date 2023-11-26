// import React from "react";
// import axios from "axios";

// import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";

// const colunas = [
//     { field: "id", headerName: "ID", width: 90 },
//     { field: "sigla", headerName: "Sigla", width: 180 },
//     { field: "nome", headerName: "Nome", width: 180 },
// ];

// function Materias(){
//     const [id, setId] = React.useState("");
//     const [sigla, setSigla] = React.useState("");
//     const [nome, setNome] = React.useState("");

//     const [openMessage, setOpenMessage] = React.useState(false);
//     const [messageText, setMessageText] = React.useState("");
//     const [ messageSeverity, setMessageSeverity] = React.useState("Seccess");

//     const [listaMaterias, setListaMaterias] = React.useState([]);

//     React.useEffect(() => {
//         getData();
//     }, []);

//     async function getData(){
//         try{
//             const res = await axios.get("/materias");
//             setListaMaterias(res.data);
//             console.log(res.data);
//         } catch (erro){
//             setListaMaterias([]);
//         }
//     }

//     function clearForm(){
//         setId("");
//         setSigla("");
//         setNome("");
//     }

//     function handleCancelClick(){
//         if(id != "" || sigla != "" || nome != ""){
//             setMessageText("Cadastro de materia CANCELADO!");
//             setMessageSeverity("WARNING");
//             setOpenMessage(true);
//         }
//         clearForm();
//     }

//     async function handleSubmit(){
//         if(id != "" && sigla != "" && nome != ""){
//             try{
//                 await axios.post("/materias", {
//                     id: id,
//                     sigla: sigla,
//                     nome: nome,
//                 });
//                 console.log(`Id: ${id} - Sigla: ${sigla} - Nome: ${nome}`);
//                 setMessageText("Materia cadastrada com sucesso!");
//                 setMessageSeverity("success");
//                 clearForm();
//             } catch (erro){
//                 console.log(erro);
//                 setMessageText("Falha no cadastro da materia!");
//                 setMessageSeverity("erro");
//             } finally{
//                 setOpenMessage(true);
//                 await getData();
//             }
//         } else{
//             setMessageText("Dados inválidos!");
//             setMessageSeverity("warning");
//             setOpenMessage(true);
//         }
//     }

//     function handleCloseMessage(_, reason){
//         if(reason === "clickaway"){
//             return;
//         }
//         setOpenMessage(false);
//     }

//     return (
//         <Box>
//             <Stack spacing={2}>
//                 <Stack spacing={2}>
//                     <TextField
//                         required
//                         id="id-input"
//                         label="Nome"
//                         size="small"
//                         onChange={(e) => setId(e.target.value)}
//                         value={id}
//                     />
//                     <TextField
//                         required
//                         id="sigla-input"
//                         label="Sigla"
//                         size="small"
//                         onChange={(e) => setSigla(e.target.value)}
//                         value={sigla}
//                     />
//                     <TextField
//                         required
//                         id="nome-input"
//                         label="Nome"
//                         size="small"
//                         onChange={(e) => setNome(e.target.value)}
//                         value={nome}
//                     />
//                 </Stack>
//                 <Stack direction="row" spacing={3}>
//                     <Button
//                         variant="contained"
//                         style={{
//                             maxWidth: "100px",
//                             minWidth: "100px",
//                         }}
//                         onClick={handleSubmit}
//                         type="submit"
//                         color="primary"
//                     >
//                         Enviar
//                     </Button>
//                     <Button
//                         variant="outlined"
//                         style={{
//                             maxWidth: "100px",
//                             minWidth: "100px",
//                         }}
//                         onClick={handleCancelClick}
//                         color="error"
//                     >
//                         Cancelar
//                     </Button>
//                 </Stack>

//                 <Snackbar
//                     open={openMessage}
//                     autoHideDuration={6000}
//                     onClose={handleCloseMessage}
//                 >
//                     <Alert
//                         severity={messageSeverity}
//                         onClose={handleCloseMessage}
//                     >
//                         {messageText}
//                     </Alert>
//                 </Snackbar>
//                 <Box style={{ height: "500px" }}>
//                     <DataGrid rows={listaMaterias} columns={colunas} />
//                 </Box>
//             </Stack>
//         </Box>
//     );
// }

// export default Materias;