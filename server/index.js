const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const CryptoJS = require("crypto-js");

const app = express();
app.use(bodyParser.json());

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
});

app.post("/school", (req, res) => {
  let school = req.body.school;
  if (typeof school != "string") {
    res.json({
      result: false,
      reason: "옳바르지 않은 데이터 타입입니다.",
    });
    return;
  }

  const headers = { "Content-Type": "application/json" };
  axios
    .get(
      `${apiConfig.url}?KEY=${apiConfig.key}&Type=json&pIndex=1&pSize=20&SCHUL_NM=${school}`,
      { headers: headers }
    )
    .then((apiRes) => apiRes.data)
    .then((apiRes) => {
      if (apiRes.schoolInfo) {
        let schools = apiRes.schoolInfo[1].row;
        schools = schools.reduce((a, c) => [...a, c.SCHUL_NM], []);

        res.json({
          result: true,
          data: schools,
        });
      } else {
        if (apiRes.RESULT.CODE == "INFO-200") {
          res.json({ result: true, data: [] });
        } else {
          res.json({
            result: false,
            reason: `fetch 실패 - ${apiRes.RESULT.MESSAGE}`,
          });
        }
      }
    })
    .catch((err) => {
      res.json({
        result: false,
        reason: `fetch 오류 - ${err}`,
      });
    });
});

app.post("/done", (req, res) => {
  let grade = req.body.grade;
  let name = req.body.name;
  let school = req.body.school;
  let secret = req.body.secret;

  if (
    typeof grade != "string" ||
    typeof name != "string" ||
    typeof school != "string" ||
    typeof secret != "string"
  ) {
    res.json({
      result: false,
      reason: "옳지 않은 형식입니다!",
    });
    return;
  }

  if (
    grade.length != 5 ||
    isNaN(grade) ||
    !(name.length > 0 && name.length <= 20) ||
    school.length == 0 ||
    secret.length == 0
  ) {
    res.json({
      result: false,
      reason: "옳지 않은 형식입니다!",
    });
    return;
  }
  grade = Number(grade);

  const key = "gmma";
  secret = CryptoJS.AES.decrypt(secret, key);
  try {
    secret = secret.toString(CryptoJS.enc.Utf8);
    if (isNaN(secret)) new Error("숫자가 아닙니다!");
  } catch (e) {
    res.json({
      result: false,
      reason: "잘못된 코드입니다.",
    });
    return;
  }

  if (secret <= 28000) {
    res.json({
      result: false,
      reason: "영상을 30초 이상 시청하지 않았습니다.",
    });
    return;
  }

  // DB에 저장하는 코드 추가하기
  console.log(`${school}의 ${grade} ${name}님이 영상 시청을 완료했습니다.`);
  res.json({ result: true });
});

app.use(express.static(client));

app.listen(8888, () => {
  console.log("Server activated on port 8888");
});
