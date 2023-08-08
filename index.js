const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json())

const config = path.join(__dirname, "config/db.json");
const connection = mysql.createConnection(
    JSON.parse(fs.readFileSync(config))
);
connection.connect();
console.log("MySQL connected");

async function query(queryStr, params) {
    const [rows, fields] = await connection.promise().query(queryStr, params);
    return rows;
}

app.get("/form", (req, res) => {

})