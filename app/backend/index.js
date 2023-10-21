const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3010, () => console.log("Servidor rodando na porta 3010."));

const horarios_cc = require("./horarios_cc");
const cursos = require("./cursos");

app.get("/cursos", (req, res) => {
    res.json(cursos);
})

app.get("/horarios/cc", (req, res) => {
    res.json(horarios_cc);
})

app.post('/follow', (req, res) => {
    console.log('Recebi um follow');
})

app.post('/unfollow', (req, res) => {
    console.log('Recebi unfollow');
})