const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(bodyParser.json())

// const config = path.join(__dirname, "config/db.json");
// const connection = mysql.createConnection(
//     JSON.parse(fs.readFileSync(config))
// );
// connection.connect();
// console.log("MySQL connected");

const apiConfigPath = path.join(__dirname, "config/api.json");
const apiConfig = JSON.parse(fs.readFileSync(apiConfigPath));

async function query(queryStr, params) {
    const [rows, fields] = await connection.promise().query(queryStr, params);
    return rows;
}

const client = path.join(__dirname, "../client/build");
app.get("/app", (req, res) => {
    res.sendFile(client + "/index.html");
})

app.post("/school", (req, res) => {
    let school = req.body.school;
    if (typeof school != "string") {
        res.json({
            result: false,
            reason: "옳바르지 않은 데이터 타입입니다."
        });
        return;
    }

    const headers = { "Content-Type": "application/json" }
    axios.get(`${apiConfig.url}?serviceKey=${apiConfig.key}&type=json&pageNo=1&numOfRows=100&schoolNm=${school}`, {headers: headers})
    .then((apiRes) => apiRes.data)
    .then((apiRes) => {
        apiRes = apiRes.response;
        console.log(apiRes);
        if (apiRes.body) {
            res.json({
                result: true,
                data: apiRes.body
            });
        } else {
            res.json({
                result: false,
                reason: `fetch 실패 - ${apiRes.header.resultMsg}`
            });
        }
    }).catch((err) => {
        res.json({
            result: false,
            reason: `fetch 오류 - ${err}`
        });
    })
})

app.use(express.static(client));

app.listen(8888, () => {
    console.log("Server activated on port 8888");
});