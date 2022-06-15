const express = require('express');
const cors = require('cors');
const { auth } = require('./utils/firebase');

require('dotenv').config()
const port = process.env.PORT || 9000;

const app = express ();
app.use(cors());

app.use(express.json());
app.set('view engine','ejs')

//Rutas
var usuario = require('./routes/usuario')
var maps = require('./routes/map');



app.use(express.json());

//-----------Middleware Auth to protect routes. Uncomment to test.------------

// app.use(async (req, res, next)=>{
//     const header = req.headers?.authorization;
//     let token;

//     if(!!header && header.startsWith("Bearer ")){
//         token = header.substring(7, header.length);
//     }

//     try {
//         const decodedToken = await auth.verifyIdToken(token);
//         req.user = decodedToken;
//         next();
//     } catch (error) {
//         res.sendStatus(403)
//         console.log(error)
//     }
// })

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