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
