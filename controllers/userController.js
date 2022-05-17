const { response } = require("express");
const mysql = require("mysql");
const config = require("../helpers/config.js");
const connection = mysql.createConnection(config, { multipleStatements: true });

connection.connect((error) => {
  if (error) throw error;
  console.log("conexion exitosa USER");
});

//MAPPERS OVERVIEW
module.exports.List = (request, response) => {
  var sql = `SELECT USERS.ID,FNAME,LNAME,PHOTOURL, COUNT(REPLIES.COMPLETED_AT) AS MAPS_DONE, COUNT(REPLIES.CREATED_AT) AS MAPS_PROGRESS, EMAIL
            FROM USERS JOIN ACCOMMODATIONS
            ON USERS.ID = ACCOMMODATIONS.USER_ID 
            JOIN REPLIES on REPLIES.ACCOMMODATION_ID=ACCOMMODATIONS.ID
            group by(USERS.ID)`;
  connection.query(sql, (error, rows) => {
    if (error) response.send(error);
    let obj = [{}];
    for (let x = 0; x < rows.length; x++) {
      obj[x] = {
        name: {
          id: rows[x].ID,
          name: rows[x].FNAME,
          lname: rows[x].LNAME,
          photo: rows[x].PHOTOURL,
        },
        maps: {
          done: rows[x].MAPS_DONE,
          progress: rows[x].MAPS_PROGRESS,
        },
        contact: rows[x].EMAIL,
      };
    }
    response.json(obj);
  });
};

//MAPPERS CONTRIBUTIONS TABLE ***falta verificar "all ","completed" ,"non completed" ***
module.exports.Table = (request, response) => {
  var userId = request.params.id

  var a = `select distinct NAME,a.CITY,a.COUNTRY
            from USERS u join ACCOMMODATIONS a on u.ID=a.USER_ID
            join REPLIES r on r.ACCOMMODATION_ID=a.ID
            where u.ID=${userId} order by(a.CITY)`;

  var b = `select distinct NAME,a.CITY,a.COUNTRY
            from USERS u join ACCOMMODATIONS a on u.ID=a.USER_ID
            join REPLIES r on r.ACCOMMODATION_ID=a.ID
            where u.ID=${userId} order by(a.NAME)`;
  var sql;

  request.query == a ? (sql = a) : (sql = b);

  connection.query(sql, (error, rows) => {
    if (error) response.send(error);
    let obj = [{}];
    for (let x = 0; x < rows.length; x++) {
      obj[x] = {
        name: rows[x].NAME,
        location: {
          city: rows[x].CITY,
          country: rows[x].COUNTRY,
        },
        progress: "", //implementar progreso
      };
    }
    response.json(obj);
  });
};

//MAPPER DETAILS **implementar params
module.exports.Details = (request, response) => {
  var userId = request.params.id
  var sql = `select FNAME,LNAME,r.UPDATED_AT,a.CREATED_AT,INQUIRY_ID,a.NAME,ADDRESS,a.COUNTRY,a.CITY,SUBTYPE
  from USERS u join ACCOMMODATIONS a on u.ID=a.USER_ID
  join REPLIES r on r.ACCOMMODATION_ID=a.ID
  where a.ID=1
  order by(r.UPDATED_AT)
  limit 1 `;

  var sql2 = `select FNAME,LNAME,PHOTOURL,
  count(COMPLETED_AT) as completed,
  (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress,
  sum(day(COMPLETED_AT) - day(CREATED_AT))/count(*) as days
  from USERS u join ACCOMMODATIONS a on u.ID=a.USER_ID
  where u.ID=1
  group by(u.ID);`;

  connection.query(sql2, (error, rows1) => {
    connection.query(sql, (error, rows) => {
      if (error) response.send(error);
      console.log(rows1);
      let obj = [{}];
      for (let x = 0; x < rows.length; x++) {
        obj[x] = {
          name: {
            name: rows[x].FNAME,
            lname: rows[x].LNAME,
            photo: rows1[x].PHOTOURL,
          },
          contributions: {
            total: rows1[x].completed,
            WTWcontributions: "",
            inprogress: rows1[x].inProgress,
            averageTime: rows1[x].days,
          },
          replies: {
            lastReply: rows[x].UPDATED_AT,
            lastCompletedArea: {
              Area: rows[x].INQUIRY_ID,
              location: {
                name: rows[x].NAME,
                location: {
                  city: rows[x].CITY,
                  country: rows[x].COUNTRY,
                },
              },
            },
          },
        };
      }
      response.json(obj);
    });
  });
};
