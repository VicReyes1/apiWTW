var config = {
    host: process.env.HOST,
    user: process.env.USER_db,
    password: process.env.PASS,
    database: process.env.NAME_db,
    port: 3306,
    multipleStatements: true
}

module.exports = config;