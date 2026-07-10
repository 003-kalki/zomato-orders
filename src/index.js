const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const morgan = require("morgan");

// Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const connection = require('./connector');

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

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

module.exports = app;