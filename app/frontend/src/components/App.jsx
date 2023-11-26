import React from "react";

import Container  from "@mui/material/Container";
import CssBaseline  from "@mui/material/CssBaseline";
import Grid  from "@mui/material/Unstable_Grid2";
import Stack  from "@mui/material/Stack";

//import Materias from "./Materias";
import CadastroLivro from "./CadastroLivro";
import TabelaLivro from "./TabelaLivros";
import Titulo from "./Titulo";
import Menu from "./Menu";

function App() {
    return (
        <Container sx={{ flexGrow: 1 }} maxWidth="lg" >
            <CssBaseline />
            <Grid container justifyContent="center"  spacing={2}>
                <Grid  md={6}>
                    <Stack spacing={2}>
                        <Titulo/>
                        <Menu/>
                        <CadastroLivro/>
                        <TabelaLivro/>          
                    </Stack>
                </Grid> 
            </Grid>
        </Container>
    );
}

/*
function barra_lateral(){
    return(
        <Container sx={{flexGrow: 1}} maxWidth="lg">

        </Container>
    )

}
*/

export default App;