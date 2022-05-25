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

    const consul7 = 'select sum(TIMESTAMPDIFF(DAY,CREATED_AT,COMPLETED_AT))/count(*) as days from ams_dashboard_accommodations where COMPLETED_AT is not null;'

    const consul8 = `SELECT id,CHAR_LENGTH(answers) - CHAR_LENGTH( REPLACE (answers, 'PHOTO', '1234')) AS count FROM ams_dashboard_replies;`

    const consul9 = 'select count(completed_at) as cant, month(completed_at) as mes,year(completed_at) as año from ams_dashboard_accommodations group by year(completed_at),month(completed_at) order by year(completed_at) desc,month(completed_at) desc limit 13;'
    var sql = `${consul1} ${consul2} ${consul3} ${consul4} ${consul5} ${consul6} ${consul7} ${consul8} ${consul9}`;

    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        var newDates = []

        for (let i = rows[8].length - 1; i >= 0; i--) {
            newDates.push(rows[8][i])
        }

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
                completedAMSMaps: newDates
            },

        }
        response.json(obj)
    })
}

module.exports.Table = (request,response) =>{
    var initialDate = request.params.initialDate
    var finishDate = request.params.finishDate

    const sql = `select accommodation_uid,NAME,country_name,CITY from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59';`

    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        
        let places = [{}]
        for (let x = 0; x < rows.length; x++) {
            places[x] = {
                id: rows[x].accommodation_uid,
                placeName: rows[x].NAME,
                city: `${rows[x].CITY}, ${rows[x].country_name}`,
                progress: 0
            }
        }
        response.json(places)
    })
}

module.exports.Detail = (request,response) => {
    var uid = request.params.uid

    const consul1D = `select distinct name,FNAME,LNAME,ADDRESS,a.country_name,a.CITY,SUBTYPE,photourl from ams_dashboard_users u join ams_dashboard_accommodations a on u.ID=a.USER_UID join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid where a.ACCOMMODATION_UID='${uid}';`

    const consul2D = `SELECT  inquiry_id,avg(CHAR_LENGTH(answers) - CHAR_LENGTH(REPLACE ( answers, 'PHOTO', '1234') )) AS cant FROM ams_dashboard_replies where accommodation_uid = '${uid}' group by(inquiry_id);`

    var sql = `${consul1D} ${consul2D}`
    connection.query(sql, (error, rows) =>{
        if (error) 
            response.send(error)
        var obj = {
            
                mapper:{
                    name:rows[0][0].FNAME,
                },
                accomodation:{
                    type: rows[0][0].SUBTYPE,
                    address: rows[0][0].ADDRESS,

                },
                progress: {
                    completedpercentage: 68,
                    created: rows[0][0].CREATED_AT,
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
                ],

                photo: rows[1]
            }
            
    
        response.json(obj)
    })
}