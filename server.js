const express = require('express');
const path = require('path');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const chalk = require('chalk'); // dev only
const fs = require('fs');

// Initialization
const app = express();

// Settings
const PORT = process.env.PORT || 3000;

// Middlewares
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use("/imgs", express.static(path.join(__dirname, '/public/img')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// file upload
app.use(expressFileUpload({
    limits: { fileSize: 20000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
})
);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/formulario.html'));
})

app.get('/collage', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/collage.html'));
})

app.post('/imagen', (req, res) => {
    const { imagen } = req.files;
    const { posicion } = req.body;


    imagen.mv(`./public/img/imagen-${posicion}.jpg`, (err) => {
        res.sendFile(path.join(__dirname, '/public/collage.html'));
    });
})

app.get("/deleteImg/:nombre", (req, res) => {
    const {nombre} = req.params;
    console.log(nombre);
    fs.unlink(`./public/img/${nombre}`, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/collage');
    });
})


// Starting the server
app.listen(PORT, () => {
    console.log(chalk.yellow(`\nServer is running on port ${PORT}\nhttp://localhost:${PORT}\n`));
});