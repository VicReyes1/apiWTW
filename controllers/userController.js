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
  //filtros con params y con like
  //CMAPS ASC DESC
  //IPMAPS ASC DESC
  //NAME LIKE
  //http://localhost:9000/mappers/overview?maps=ipmaps&order=asc
  var maps = request.query.maps;
  var order = request.query.order;

  console.log(request.query.maps);
  console.log(request.query.order);

  if (maps == "cmaps") {
    if (order == "asc") {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by completed ${order};
      `;
    }
    if (order == "desc") {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by completed ${order};
      `;
    } else {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by completed;
      `;
    }
  } else if (maps == "ipmaps") {
    if (order == "asc") {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by inProgress ${order};
      `;
    }
    if (order == "desc") {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by inProgress ${order};
      `;
    } else {
      var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by u.id order by inProgress;
      `;
    }
  } else if (maps == "name") {
    var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL, count(COMPLETED_AT) as completed, 
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      where FNAME like "%${order}%"
      group by u.id ;
      `;
  } else {
    //lo k sea
    var sql = `
      select u.ID, FNAME,LNAME,PHOTOURL, EMAIL,
      count(COMPLETED_AT) as completed,
      (count(CREATED_AT)-count(COMPLETED_AT)) as inProgress
      from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
      group by(u.ID);
      `;
  }
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

  var sql = `
  select distinct a.accommodation_uid as ACC_ID, u.ID, a.NAME, r.UPDATED_AT, ADDRESS, a.country_name, a.CITY
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.UID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId} order by(r.UPDATED_AT)
  `;

  /*
  var b = `select distinct NAME,a.CITY,a.country_name
  from ams_dashboard_users u join ams_dashboard_accommodations a on u.ID=a.USER_UID
  join ams_dashboard_replies r on r.ACCOMMODATION_UID=a.accommodation_uid
  where u.ID=${userId};`;*/

  //request.query == a ? (sql = a) : (sql = b);

  connection.query(sql, (error, rows) => {
    if (error) response.send(error);

    let obj = [{}];
    console.log(rows);
    for (let x = 0; x < rows.length; x++) {
      obj[x] = {
        id: rows[x].ACC_ID,
        placeName: rows[x].NAME,
        city: `${rows[x].CITY}, ${rows[x].country_name}`,
        progress: 0, //implementar progreso
      };
    }
    response.json(obj);
  });
};

//MAPPER DETAILS **implementar params
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

  connection.query(sql2, (error, rows1) => {
    connection.query(sql, (error, rows) => {
      if (error) response.send(error);

      let obj = {};

      for (let x = 0; x < rows.length; x++) {
        var date = rows[x].CREATED_AT.toISOString();

        var YYYY = date.split("-")[0];
        var MM = date.split("-")[1];
        var D = date.split("-")[2];
        var DD = D[0];
        var DD = DD + D[1];
        var HH = date.split("T")[1];
        var HH = HH.split(".")[0];

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
              day: DD,
              month: MM,
              year: YYYY,
              hour: HH,
            },
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

//COUNTRIES WHERE WTW HAS PRESENCE
module.exports.Countries = (request, response) => {
  var sql = `
  SELECT DISTINCT CITY
  FROM dashboard.ams_dashboard_users
  where CITY is not null
  order by CITY
  `;
  var sql2 = `
  SELECT DISTINCT COUNTRY 
  FROM dashboard.ams_dashboard_users
  where COUNTRY is not null
  order by COUNTRY
  `;

  connection.query(sql2, (error, rows1) => {
    connection.query(sql, (error, rows) => {
      if (error) response.send(error);

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
    });
  });
};
