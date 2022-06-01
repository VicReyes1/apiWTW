var config = {
    host: process.env.HOST,
    user: process.env.USER_db,
    password: process.env.PASS,
    database: process.env.NAME_db,
    port_db: process.env.PORT_db,
    multipleStatements: true
}

module.exports = config;