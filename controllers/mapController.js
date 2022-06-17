const { error } = require('console');
const { response } = require('express');
const { request } = require('http');
const moment = require('moment');
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

    try{
        const consul1 = `select count(*) as cantidad from ams_dashboard_accommodations as completados where COMPLETED_AT is not null and COMPLETED_AT >= '${initialDate}' and completed_at <= '${finishDate} 23:59:59';`

        const consul2 = `select count(*) as cantidad from ams_dashboard_accommodations as noCompletados where COMPLETED_AT is null or COMPLETED_AT >= '${initialDate}' and completed_at <= '${finishDate} 23:59:59';`

        const consul3 = 'select country_name,count(NAME) as cantidad from ams_dashboard_accommodations where COMPLETED_AT is not null group by(country_name);'

        const consul4 = 'select country_name,count(NAME) as cantidad from ams_dashboard_accommodations where COMPLETED_AT is not null group by(country_name) order by cantidad DESC limit 10;'

        const consul5 = 'select count (distinct country_name) as paisesC from ams_dashboard_accommodations where completed_at is not null; '

        const consul6 = 'select count (distinct LOWER(city)) as ciudadesC from ams_dashboard_accommodations;'

        const consul7 = 'select sum(TIMESTAMPDIFF(DAY,CREATED_AT,COMPLETED_AT))/count(*) as days from ams_dashboard_accommodations where COMPLETED_AT is not null;'

        const consul8 = `SELECT id,CHAR_LENGTH(answers) - CHAR_LENGTH( REPLACE (answers, 'PHOTO', '1234')) AS count FROM ams_dashboard_replies;`

        const consul9 = 'select count(completed_at) as cant, month(completed_at) as mes,year(completed_at) as año from ams_dashboard_accommodations group by year(completed_at),month(completed_at) order by year(completed_at) desc,month(completed_at) desc limit 13;'

        const consul10 = `select avg(CHAR_LENGTH(answers) - CHAR_LENGTH( REPLACE (answers, 'firebasestorage', '12345678901234') )) AS countPhoto FROM ams_dashboard_replies;`

        const consul11 = 'select distinct inquiry_id,count(inquiry_id) as menosMapeadas from ams_dashboard_replies group by inquiry_id order by count(inquiry_id) limit 3;'
        var sql = `${consul1} ${consul2} ${consul3} ${consul4} ${consul5} ${consul6} ${consul7} ${consul8} ${consul9} ${consul10} ${consul11}`;

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
                    avgNumberOfPhotos: Math.round(rows[9][0].countPhoto),
                    leastMappedAreas: rows[10],
                    avgTimeCompletionPerMap: Math.round(rows[6][0].days),
                    completedAMSMaps: newDates
                },

            }
            response.json(obj)
        })
    }catch(error){
        console.log(error)
        return response.status(500).json({
            type: "Error en el servidor",
            message: error,
            
        })
    }
    
}

module.exports.Table = (request,response) =>{
    try {
        var initialDate = request.params.initialDate
        var finishDate = request.params.finishDate
        var body = request.body

        var filter = ""
        if (body.filter == "complete") {
            filter = " and completed_at IS NOT NULL"
        }else if(body.filter == "non-complete"){
            filter = " and completed_at IS NULL"
        }
        
        var sql = ""
        if(body.countries.length == 0 && body.cities.length == 0){
            sql += `select * from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59' ${filter};`
        }else if((body.countries.length > 0 && body.cities.length == 0) || (body.countries.length > 0 && body.cities.length > 0)){
            for (let i = 0; i < body.countries.length; i++) {
                if(i == (body.countries.length -1)){
                    sql += `select * from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59' and country_name = '${body.countries[i]}' ${filter};`
                }else{
                    sql += `select * from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59' and country_name = '${body.countries[i]}' ${filter} union `
                }
            }
        }else if(body.countries.length == 0 && body.cities.length > 0){
            for (let i = 0; i < body.cities.length; i++) {
                if(i == (body.cities.length -1)){
                    sql += `select * from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59' and CITY = '${body.cities[i]}' ${filter};`
                }else{
                    sql += `select * from ams_dashboard_accommodations where created_at >= '${initialDate}' and created_at <= '${finishDate} 23:59:59' and CITY = '${body.cities[i]}' ${filter} union `
                }
            }
        }
        
        
        connection.query(sql, (error, rows) =>{
            if (error) 
                response.send(error)
            let places = [{}]
            for (let x = 0; x < rows.length; x++) {
                places[x] = {
                    id: rows[x].accommodation_uid,
                    placeName: rows[x].name,
                    city: `${rows[x].city}, ${rows[x].country_name}`,
                    progress: Math.round(rows[x].total * 100)
                }
                
                
            }
            response.json(places)
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            type: "Error en el servidor",
            message: error,
            
        })
    }
}

module.exports.Detail = (request,response) => {
    var allowToContinue = false
    var uid = request.params.uid
        const arrOfZones = [
            "building_entrance",
            "elevator",
            "general_attributes",
            "lobby",
            "rooms"
        ]
        var arrScores = []

        var objPorcents = [{}]

    try {
        for (let i = 0; i < arrOfZones.length; i++) {
            const sql0 = `SELECT ${arrOfZones[i]} as score FROM ams_dashboard_accommodations WHERE accommodation_uid = '${uid}';`
            connection.query(sql0,(error,rows0) =>{
                if (error) 
                    response.send(error)
                if(rows0.length == 0){
                    allowToContinue = false
                }else{
                    allowToContinue == true
                    if (rows0[0].score == null) {
                        arrScores[i] = 0
                    }else{
                        arrScores[i] = Math.round(rows0[0].score* 100)
                    }
                    
                }
            })
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            type: "Error en el servidor",
            message: error,
            
        })
    }
    try {

        const consul1D = `SELECT * FROM ams_dashboard_accommodations  JOIN ams_dashboard_users ON  ams_dashboard_accommodations.user_uid = ams_dashboard_users.uid WHERE accommodation_uid = '${uid}';`

        const consul2D = `SELECT completed_at FROM ams_dashboard_replies WHERE accommodation_uid = '${uid}' GROUP BY (completed_at)limit 1;`

        const consul3D = `SELECT created_at FROM ams_dashboard_replies WHERE accommodation_uid = '${uid}' GROUP BY (created_at)limit 1;`

        const consul4D = `SELECT  inquiry_id,avg(CHAR_LENGTH(answers) - CHAR_LENGTH(REPLACE ( answers, 'PHOTO', '1234') )) AS cant FROM ams_dashboard_replies where accommodation_uid = '${uid}' group by(inquiry_id);`
            var sql = `${consul1D} ${consul2D} ${consul3D} ${consul4D}`
            connection.query(sql, (error, rows) =>{
                if (error) 
                    response.send(error)
                    if (arrScores.length == 0) {
                        return response.status(404).json({
                            type: "User Error",
                            message: "No matching resources",
                            
                        })
                    }
                        for (let x = 0; x < arrOfZones.length; x++) {
                            objPorcents[x] = {
                                name: arrOfZones[x],
                                process: arrScores[x]
                            }
                                
                        }
                        var last = ""
                        var days = 0
                        if (rows[0][0].completed_at == null) {
                            if(rows[1][0] !== undefined ){
                                if (rows[1][0].completed_at != null) {
                                    last = rows[1][0].completed_at
                                    days = moment(last).diff((rows[0][0].created_at),'days')
                                }
                                else if(rows[1][0] === undefined  && rows[2][0] !== undefined){
                                    if (rows[2][0].created_at != null) {
                                        last = rows[2][0].created_at
                                        days = moment(last).diff((rows[0][0].created_at),'days')
                                    }else{
                                        last = "No information"
                                        days = moment().diff((rows[0][0].created_at),'days')
                                    }
                                }else{
                                    last = "No information"
                                    days = moment().diff((rows[0][0].created_at),'days')
                                }
                            }
                        }else{
                            last = rows[0][0].completed_at
                            days = moment(last).diff((rows[0][0].created_at),'days')
                        }
            
                        if(last != "No information"){
                            if(days == 0 && rows[0][0].completed_at == null){
                                days = moment().diff((rows[0][0].created_at),'days')
                            }else if(days == 0 && rows[0][0].completed_at != null){
                                var days2 = moment(rows[0][0].completed_at).diff((rows[0][0].created_at),'days')
                                if (days2 == 0) {
                                    days = 1
                                }else{
                                    days = days2
                                }
                            }
                        }else{
                            last = rows[0][0].created_at
                            days = moment().diff((rows[0][0].created_at),'days')
                        }
            
                        if (rows[0][0].photourl == null) {
                            rows[0][0].photourl = "No information"
                        }
                        
                        if (rows[3].length == 0) {
                            rows[3] = "No information"
                        }
            
                        var obj = {
                            
                                mapper:{
                                    idMapper: rows[0][0].id,
                                    name:rows[0][0].fname,
                                    lastname: rows[0][0].lname,
                                    photo: rows[0][0].photourl
                                },
                                accomodation:{
                                    nameHotel: rows[0][0].name,
                                    type: rows[0][0].subtype,
                                    address: rows[0][0].address,
            
                                },
                                progress: {
                                    completedpercentage:  Math.round(rows[0][0].total * 100),
                                    created: rows[0][0].created_at,
                                    duration: days,
                                    lastUpdate: last
            
                                },
                                progressAreas: objPorcents,
            
                                photos: rows[3]
                                
                            }
                        
                    response.json(obj)
            })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            type: "Error en el servidor",
            message: error,
            
        })
    }
    
}