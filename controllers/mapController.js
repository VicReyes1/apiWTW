const { response } = require('express');
const mysql = require ('mysql');
const config = require('../helpers/config.js')
const connection = mysql.createConnection(config);
connection.connect(error => {
    if (error) throw error;
    console.log('conexion exitosa MAP'); 
});

module.exports.Over = (request, response) =>{

    const consul1 = 'select count(*) as cantidad from ams_dashboard_accommodations as completados where COMPLETED_AT is not null;'

    const consul2 = 'select count(*) as cantidad from ams_dashboard_accommodations as noCompletados where COMPLETED_AT is null;'

    const consul3 = 'select country_name,count(NAME) as cantidad from ams_dashboard_accommodations where COMPLETED_AT is not null group by(country_name);'

    const consul4 = 'select country_name,count(NAME) as cantidad from ams_dashboard_accommodations where COMPLETED_AT is not null group by(country_name) order by cantidad DESC limit 10;'

    const consul5 = 'select count (distinct country_name) as paisesC from ams_dashboard_accommodations; '

    const consul6 = 'select count (distinct city) as ciudadesC from ams_dashboard_accommodations;'

    const consul9 = 'select sum(TIMESTAMPDIFF(DAY,CREATED_AT,COMPLETED_AT))/count(*) as days from ams_dashboard_accommodations where COMPLETED_AT is not null;'
    

    var sql = `${consul1} ${consul2} ${consul3} ${consul4} ${consul5} ${consul6} ${consul9}`;

    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        var obj= {
            summary: {
                completedMaps: rows[0][0].cantidad,
                mapsInProgress: rows[1][0].cantidad
            },
            allTimeStatistics: {
                worldwideInsights: rows[2],
                highlights: rows[3],
                presence: {
                    countryNumber: rows[4][0].paisesC,
                    destinationNumber: rows[5][0].ciudadesC
                },
                avgNumberOfPhotos: 5,
                leastMappedAreas: [
                    "Building Entrance",
                    "Food Service Area"
                ],
                avgTimeCompletionPerMap: Math.round(rows[6][0].days)

            },

        }
        response.json(obj)
    })
}

