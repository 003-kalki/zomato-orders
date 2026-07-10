const mysql = require("mysql2");

const isProduction =
    process.env.NODE_ENV === "production" || Boolean(process.env.RAILWAY_ENVIRONMENT_NAME);
const requiredDatabaseVariables = [
    "MYSQLHOST",
    "MYSQLUSER",
    "MYSQLPASSWORD",
    "MYSQLDATABASE"
];

const missingDatabaseVariables = requiredDatabaseVariables.filter(
    (name) => !process.env[name]
);


if (isProduction && missingDatabaseVariables.length > 0) {
    console.error(
        `Missing database configuration: ${missingDatabaseVariables.join(", ")}`
    );
    process.exit(1);
}

const con = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "test",
    port: Number(process.env.MYSQLPORT) || 3306
});

con.connect((err) => {
    if (err) {
        console.error("Failed to connect to the MySQL database.", err.message);

        if (isProduction) {
            process.exit(1);
        }

        return;
    }

    console.log("Connected to the MySQL database.");
});

module.exports = con;
