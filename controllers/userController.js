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
  var sql = `select u.ID, FNAME,LNAME,PHOTOURL,
  count(COMPLETED_AT) as completed,
  (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  group by(u.ID);`;

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
          done: rows[x].completed,
          progress: rows[x].inProgress,
        },
        contact: rows[x].EMAIL,
      };
    }
    response.json(obj);
  });
};

//MAPPERS CONTRIBUTIONS TABLE ***falta verificar "all ","completed" ,"non completed" ***
module.exports.Table = (request, response) => {
  var userId = request.params.id;

  var sql = `select distinct a.name ,r.UPDATED_AT,ADDRESS,a.country_name,a.CITY
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId} order by(r.UPDATED_AT)`;

  /*
  var b = `select distinct NAME,a.CITY,a.country_name
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.ID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId};`;*/

  //request.query == a ? (sql = a) : (sql = b);

  connection.query(sql, (error, rows) => {
    if (error) response.send(error);
    let obj = [{}];

    for (let x = 0; x < rows.length; x++) {
      obj[x] = {
        placeName: rows[x].name,
        city: `${rows[x].CITY}, ${rows[x].country_name}`,
        // location: {
        //   city: rows[x].CITY,
        //   country: rows[x].country_name,
        // },
        progress: "", //implementar progreso
      };
    }
    response.json(obj);
  });
};

//MAPPER DETAILS **implementar params
module.exports.Details = (request, response) => {
  var userId = request.params.id;
  var sql = `select a.name, r.UPDATED_AT,INQUIRY_ID,ADDRESS,a.country_name,a.CITY
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId}
  limit 1;`;

  var sql2 = `select FNAME,LNAME,PHOTOURL,
  count(COMPLETED_AT) as completed,
  (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress,
  sum(TIMESTAMPDIFF(DAY,CREATED_AT,COMPLETED_AT))/count(*) as days
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  where u.ID=${userId}
  group by(u.ID); `;

  connection.query(sql2, (error, rows1) => {
    connection.query(sql, (error, rows) => {
      if (error) response.send(error);

      let obj = {};
      for (let x = 0; x < rows.length; x++) {
        obj = {
          name: {
            name: rows1[x].FNAME,
            lname: rows1[x].LNAME,
            photo: rows1[x].PHOTOURL,
          },
          contributions: {
            total: rows1[x].completed,
            WTWcontributions: "Pending",
            inprogress: rows1[x].inProgress,
            averageTime: rows1[x].days,
          },
          replies: {
            lastReply: rows[x].UPDATED_AT,
            lastCompletedArea: {
              Area: rows[x].INQUIRY_ID,
              location: {
                name: rows[x].name,
                location: {
                  city: rows[x].CITY,
                  country: rows[x].country_name,
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
