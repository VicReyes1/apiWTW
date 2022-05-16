const { response } = require('express');
const mysql = require ('mysql');
const config = require('../helpers/config.js')
const connection = mysql.createConnection(config);
connection.connect(error => {
    if (error) throw error;
    console.log('conexion exitosa MAP'); 
});

module.exports.Over = (request, response) =>{

    var sql = 'select count(*) as completedMaps from ACCOMMODATIONS where COMPLETED_AT  is not null; select count(*) as mapsInProgress from ACCOMMODATIONS where COMPLETED_AT is null; select COUNTRY,count(NAME) as cantidad from ACCOMMODATIONS where COMPLETED_AT is not null group by(COUNTRY);select COUNTRY,count(NAME) as cantidad from ACCOMMODATIONS where COMPLETED_AT is null group by(COUNTRY);select COUNTRY,count(NAME) as cantidad from ACCOMMODATIONS where COMPLETED_AT is not null group by(COUNTRY) order by cantidad limit 10; select sum(day(COMPLETED_AT) - day(CREATED_AT))/count(*) as days from ACCOMMODATIONS where COMPLETED_AT is not null'
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
                map: rows[2],
                mapN: rows[3]
            }
        }

        var highlights = {
            highlights:rows[4]
        }
        var avgTimeCompletionPerMap = {
            avgTimeCompletionPerMap:{
                days: rows[5][0].days
            }
        }
        
        var finalObject = Object.assign(weeklySummary,worldwideInsights,highlights,avgTimeCompletionPerMap)
        
        response.json(finalObject)
    })
}

