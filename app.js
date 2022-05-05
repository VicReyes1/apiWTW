const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT_serv;

const app = express ();
app.use(cors());


app.use(express.json());
app.set('view engine','ejs')

//Rutas
var usuario = require('./routes/usuario')



app.use(express.json());
app.use('/mappers',usuario)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
