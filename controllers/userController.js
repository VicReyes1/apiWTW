const { response } = require('express');
const mysql = require ('mysql');
const config = require('../helpers/config.js')
const connection = mysql.createConnection(config);
connection.connect(error => {
    if (error) throw error;
    console.log('conexion exitosa USER'); 
});

module.exports.List = (request, response) =>{

    var sql = 'SELECT * FROM USERS'
    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        console.log(rows)
        const payload = {
            USER: {
                EMAIL: rows[0].EMAIL,
                FNAME: rows[0].FNAME
            },
        }
        response.json(payload)
    })
}