const { response } = require('express');
const mysql = require ('mysql');
const config = require('../helpers/config.js')
const connection = mysql.createConnection(config);
connection.connect(error => {
    if (error) throw error;
    console.log('conexion exitosa MAP'); 
});

module.exports.Over = (request, response) =>{

    var sql = 'select count(*) as completedMaps from ACCOMMODATIONS where COMPLETED_AT  is not null; select count(*) as mapsInProgress from ACCOMMODATIONS where COMPLETED_AT is null; select COUNTRY,count(NAME) as cantidad from ACCOMMODATIONS where COMPLETED_AT is not null group by(COUNTRY); select COUNTRY,count(NAME) as cantidad from ACCOMMODATIONS where COMPLETED_AT is not null group by(COUNTRY) order by cantidad limit 10'
    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        var weeklySummary= {
            weeklySummary: {
                completedMaps: rows[0][0].completedMaps,
                mapsInProgress: rows[1][0].mapsInProgress
            }
        }

        var worldwideInsights = {
            worldwideInsights:{
                map: rows[2]
            }
        }

        var highlights = {
            highlights:rows[3]
        }
        
        
        
        response.json(Object.assign(weeklySummary,worldwideInsights,highlights))
    })
}

