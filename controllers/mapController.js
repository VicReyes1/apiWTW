const { response } = require('express');
const { request } = require('http');
const mysql = require ('mysql');
const config = require('../helpers/config.js')
const connection = mysql.createConnection(config);
connection.connect(error => {
    if (error) throw error;
    console.log('conexion exitosa MAP'); 
});

module.exports.Over = (request, response) =>{
    var initialDate = request.params.initialDate
    var finishDate = request.params.finishDate
    
    const consul1 = `select count(*) as cantidad from ams_dashboard_accommodations as completados where COMPLETED_AT is not null and COMPLETED_AT >= '${initialDate}' and completed_at <= '${finishDate} 23:59:59';`

    const consul2 = `select count(*) as cantidad from ams_dashboard_accommodations as noCompletados where COMPLETED_AT is null or COMPLETED_AT >= '${initialDate}' and completed_at <= '${finishDate} 23:59:59';`

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
                avgTimeCompletionPerMap: Math.round(rows[6][0].days),

            },

        }
        response.json(obj)
    })
}

module.exports.Table = (request,response) =>{
    var initialDate = request.params.initialDate
    var finishDate = request.params.finishDate

    const sql = `select NAME,country_name,CITY from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59';`

    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        
        let places = [{}]
        for (let x = 0; x < rows.length; x++) {
            places[x] = {
                placeName: rows[x].NAME,
                city: `${rows[x].CITY}, ${rows[x].country_name}`,
                progress: 0
            }
        }
        response.json(places)
    })
}

module.exports.Detail = (request,response) => {
    const sql = 'select FNAME,LNAME,r.UPDATED_AT,a.CREATED_AT, INQUIRY_ID,ADDRESS,a.country_name,a.CITY,a.CREATED_AT,SUBTYPE from ams_dashboard_users u join ams_dashboard_accommodations a on u.ID=a.USER_UID join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid where a.ID=1 order by(r.UPDATED_AT) limit 1;'
    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        var obj = {
            
                mapper:{
                    name:rows[0].FNAME,
                },
                accomodation:{
                    type: rows[0].SUBTYPE,
                    address: rows[0].ADDRESS,

                },
                progress: {
                    completedpercentage: 68,
                    created: rows[0].CREATED_AT,
                    duration: 6,
                    lastUpdate: rows[0].UPDATED_AT

                },
                progressAreas: [
                    {
                        name: "Building entrance",
                        percentage: 100
                    },
                    {
                        name: "Food service",
                        percentage: 70
                    },
                    {
                        name: "Looby",
                        percentage: 50
                    },
                ]
            }
            
    
        response.json(obj)
    })
}