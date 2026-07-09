var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "maria@2026",
    database: process.env.MYSQLDATABASE || "test",
    port: process.env.MYSQLPORT || 3306,
    multipleStatements: true
});

con.connect(function (err) {
    if (err) {
        console.log("failed to connect to mysql server/database", err);
        return;
    }

    console.log("connection established with database!");
});

module.exports = con;