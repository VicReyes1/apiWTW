const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 9000;

const app = express ();
app.use(cors());


app.use(express.json());
app.set('view engine','ejs')

//Rutas
var usuario = require('./routes/usuario')
var maps = require('./routes/map')



app.use(express.json());
app.use('/mappers',usuario)
app.use('/maps',maps)

app.get('/', (req, res) => {
    return res.status(200).json({
        message: `Hello world`
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//TQM coladera de errores
app.use((err, req, res, next)=>{
    return res.status(500).json({
        "name": err.name,
        "message": `${err.message}, ${err.original ? err.original : ':('}`,
    })
})