const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const morgan = require("morgan");
const data = require("./data");

// Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const connection = require('./connector');

function query(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });
}

async function initializeDatabase() {
    await query(`
        CREATE TABLE IF NOT EXISTS orders (
            _id VARCHAR(200) PRIMARY KEY,
            title VARCHAR(100),
            description VARCHAR(1000)
        )
    `);

    const [{ count }] = await query("SELECT COUNT(*) AS count FROM orders");

    if (count === 0) {
        const rows = data.map(({ _id, title, description }) => [
            _id,
            title,
            description
        ]);

        await query(
            "INSERT INTO orders (_id, title, description) VALUES ?",
            [rows]
        );
        console.log(`Seeded ${rows.length} orders.`);
    }
}

app.get("/api/orders", (req, res) => {

    let limit =
        req.query.limit === undefined
            ? 10
            : Number(req.query.limit);

    let offset =
        req.query.offset === undefined
            ? 0
            : Number(req.query.offset);

    const validLimit =
        Number.isInteger(limit) && limit > 0;

    const validOffset =
        Number.isInteger(offset) && offset >= 0;

    if (!validLimit || !validOffset) {
        limit = 10;
        offset = 0;
    }

    connection.query(
        "SELECT * FROM orders LIMIT ? OFFSET ?",
        [limit, offset],
        (err, result) => {

            if (err) {
         console.error("Database Error:", err);

         return res.status(500).json({
        message: err.message
            });
          }
             return res.status(200).json(result);
        }
    );
});

initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`App listening on port ${port}!`);
        });
    })
    .catch((err) => {
        console.error("Database initialization failed:", err.message);
        process.exit(1);
    });

module.exports = app;
