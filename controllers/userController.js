const { response } = require("express");
const mysql = require("mysql");
const config = require("../helpers/config.js");
const connection = mysql.createConnection(config, { multipleStatements: true });

connection.connect((error) => {
  if (error) throw error;
  console.log("conexion exitosa USER");
});

/*
TODO 
implementar offset en demas endpoints Zzzzz
queries vacias 404 
hacer pruebas con offset pipisiado 
*/

//MAPPERS OVERVIEW
module.exports.List = (request, response) => {
  //URI format -> http://localhost:9000/mappers/overview?maps=ipmaps&order=asc&page=3
  var sql = ``;
  var maps = request.query.maps;
  var order = request.query.order;
  var nombre = request.query.nombre;
  //var page = request.query.page * 9;

  if (maps && order) {
    sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as cmaps, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as ipmaps
      from ams_dashboard_users u 
      join ams_dashboard_accommodations a 
      on u.UID=a.USER_UID
      group by u.id
      order by ${maps} ${order} `;
    //limit 9 offset ${page};
    //`;
  } else if (nombre) {
    sql = `
       select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as cmaps, 
       (count(CREATED_AT)-count(COMPLETED_AT)) as ipmaps
       from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
       where LNAME like "%${nombre}%" or FNAME like "%${nombre}%"
       group by u.id `;
    // limit 9 offset ${page};
    //`;
  } else {
    sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL,
      count(COMPLETED_AT) as cmaps,
      (count(CREATED_AT)-count(COMPLETED_AT)) as ipmaps
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by (u.ID);`;
    // limit 9 offset ${page};
    //`;
  }

  connection.query(sql, (error, rows) => {
    try {
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
            done: rows[x].cmaps,
            progress: rows[x].ipmaps,
          },
          contact: rows[x].EMAIL,
        };
      }
      rows == ""
        ? response.status(404).json("No matches found")
        : response.json(obj);
    } catch (error) {
      return response.status(400).json("Bad request");
    }
  });
};

//MAPPERS CONTRIBUTIONS TABLE
module.exports.Table = (request, response) => {
  //URI format -> http://localhost:9000/mappers/contributions/2?page&=3

  var sql = ``;
  var userId = request.params.id;
  var body = request.body;
  //var page = request.params.page * 5; // ta mal

  if (body.countries.length == 0 && body.cities.length == 0) {
    sql += `SELECT a.accommodation_uid as ACC_ID, NAME, a.CITY, country_name 
            FROM ams_dashboard_accommodations a join ams_dashboard_users b
            on user_uid = b.uid
            where b.id = ${userId}`;
    //limit 5 offset ${page}
    //`;
  } else if (
    (body.countries.length > 0 && body.cities.length == 0) ||
    (body.countries.length > 0 && body.cities.length > 0)
  ) {
    for (let i = 0; i < body.countries.length; i++) {
      if (i == body.countries.length - 1) {
        sql += `select distinct a.accommodation_uid as ACC_ID, u.ID, a.NAME, r.UPDATED_AT, ADDRESS, a.country_name, a.CITY
                from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
                join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
                where u.id= ${userId} and country_name = '${body.countries[i]}' 
                order by(r.UPDATED_AT)`;
      } else {
        sql += `select distinct a.accommodation_uid as ACC_ID, u.ID, a.NAME, r.UPDATED_AT, ADDRESS, a.country_name, a.CITY
                from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
                join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
                where u.id= ${userId} and country_name = '${body.countries[i]}' 
                order by(r.UPDATED_AT) union`;
      }
    }
  } else if (body.countries.length == 0 && body.cities.length > 0) {
    for (let i = 0; i < body.cities.length; i++) {
      if (i == body.cities.length - 1) {
        sql += `select distinct a.accommodation_uid as ACC_ID, u.ID, a.NAME, r.UPDATED_AT, ADDRESS, a.country_name, a.CITY
                from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
                join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
                where u.id= ${userId} and a.CITY = '${body.cities[i]}' 
                order by(r.UPDATED_AT)`;
      } else {
        sql += `select distinct a.accommodation_uid as ACC_ID, u.ID, a.NAME, r.UPDATED_AT, ADDRESS, a.country_name, a.CITY
                from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
                join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
                where u.id= ${userId} and a.CITY ='${body.cities[i]}' 
                order by(r.UPDATED_AT) union`;
      }
    }
  }
  try {
    connection.query(sql, (error, rows) => {
      if (error) response.send(error);

      let obj = [{}];

      for (let x = 0; x < rows.length; x++) {
        obj[x] = {
          id: rows[x].ACC_ID,
          placeName: rows[x].NAME,
          city: `${rows[x].CITY}, ${rows[x].country_name}`,
          progress: 0, //TODO: implementar progreso
        };
      }

      rows == ""
        ? response.status(404).json("No matches found")
        : response.json(obj);
    });
  } catch (error) {
    return response.status(400).json({ error: error.toString() });
  }
};

//MAPPER DETAILS
module.exports.Details = (request, response) => {
  var userId = request.params.id;
  var sql = `
  select a.name, r.CREATED_AT,INQUIRY_ID,ADDRESS,a.country_name,a.CITY
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId}
  limit 1;
  `;

  var sql2 = `
  select FNAME,LNAME,PHOTOURL, count(COMPLETED_AT) as completed, 
  (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress, 
  sum(TIMESTAMPDIFF(DAY,CREATED_AT,COMPLETED_AT))/count(*) as days
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  where u.ID=${userId}
  group by(u.ID);
  `;

  try {
    connection.query(sql2, (error, rows1) => {
      connection.query(sql, (error, rows) => {
        if (error) response.send(error);

        let obj = {},
          x,
          y;

        if (rows.length == 0) {
          y = rows1.length;
        } else {
          y = rows.length;
          var date = rows[0].CREATED_AT.toISOString();
          var YYYY = date.split("-")[0];
          var MM = date.split("-")[1];
          var D = date.split("-")[2];
          var DD = D[0];
          var DD = DD + D[1];
          var HH = date.split("T")[1];
          var HH = HH.split(".")[0];
          var inqid = rows[0].INQUIRY_ID;
          var nomh = rows[0].name;
          var ciudad = rows[0].CITY;
          var country = rows[0].country_name;
        }

        for (x = 0; x < y; x++) {
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
              lastReply: {
                day: DD || "unavailable",
                month: MM || "unavailable",
                year: YYYY || "unavailable",
                hour: HH || "unavailable",
              },
              lastCompletedArea: {
                Area: inqid || "unavailable",
                location: {
                  name: nomh || "unavailable",
                  location: {
                    city: ciudad || "unavailable",
                    country: country || "unavailable",
                  },
                },
              },
            },
          };
        }
        rows1 == ""
          ? response.status(404).json("No matches found")
          : response.json(obj);
      });
    });
  } catch (error) {
    return response.status(400).json({ error: error.toString() });
  }
};

//COUNTRIES WHERE WTW HAS PRESENCE
module.exports.Countries = (request, response) => {
  var sql = ` SELECT distinct CITY FROM dashboard.ams_dashboard_accommodations order by city`;
  var sql2 = `SELECT distinct country_name as COUNTRY FROM dashboard.ams_dashboard_accommodations order by country_name`;
  try {
    connection.query(sql2, (error, rows1) => {
      connection.query(sql, (error, rows) => {
        if (error) response.send(error);
        if (rows == "" || rows1 == "") {
          return response
            .status(404)
            .json("No existen resultados para esta busqueda");
        } else {
          let obj1 = [];

          for (let i = 0; i < rows1.length; i++) {
            obj1[i] = rows1[i].COUNTRY;
          }
          obj1 = { countries: obj1 };

          let obj = [];

          for (let i = 0; i < rows.length; i++) {
            obj[i] = rows[i].CITY;
          }
          obj = { cities: obj };

          const finalOBJ = Object.assign(obj, obj1);
          response.json(finalOBJ);
        }
      });
    });
  } catch (error) {
    return response.status(400).json({ error: error.toString() });
  }
};
