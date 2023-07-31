const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const app = express();

//lấy resume reading từ database
router.get("/user/:idUser", (req, res) => {
  let sql = "call Get_resume_reading(?)";
  sqlConnection(sql, [req.params.idUser], (err, results) => {
    if (err) {
      res.send("User not exist");
    } else {
      if (results.length == 0) {
        res.send("User not reading yet");
      } else {
        res.send(results);
      }
    }
  });
});

//thêm 1 resume reading
router.post("/add", (req, res) => {
  let idManga = String(req.body.idManga);
  let idUser = String(req.body.idUser);
  let idChapter = String(req.body.chapterId);
  let percent_read = String(req.body.percent_read);
  let time_read = String(req.body.time_read);
  let total_height = String(req.body.total_height);

  let sql =
    "replace into resume_reading (manga_idManga,user_idUser, chapter_idChapter, time_read, percent_read, total_height) values (" +
    idManga +
    "," +
    idUser +
    "," +
    idChapter +
    "," +
    time_read +
    "," +
    percent_read +
    "," +
    total_height +
    ");";
  sqlConnection(sql, (err, results) => {
    if (err) {
      res.send("Add resume reading fail");
    } else {
      if (results.length == 0) {
        res.send("User does not read yet");
      } else {
        res.send(results);
      }
    }
  });
});

//thêm toàn bộ resume reading mới
router.post("/addall", (req, res) => {
  let data = req.body;
  let length = Object.keys(data).length;
  let idManga, idUser, idChapter, time_read, percent_read, total_height;
  let statement;
  let sql = "";

  for (let i = 0; i < length; i++) {
    idManga = String(data[i].idManga);
    idUser = String(data[i].idUser);
    idChapter = String(data[i].chapterId);
    percent_read = String(data[i].percent_read);
    time_read = String(data[i].time_read);
    total_height = String(data[i].total_height);

    statement =
      "replace into resume_reading (manga_idManga,user_idUser, chapter_idChapter, time_read, percent_read, total_height) values (" +
      idManga +
      "," +
      idUser +
      "," +
      idChapter +
      "," +
      time_read +
      "," +
      percent_read +
      "," +
      total_height +
      ");";
    sql += statement + "\n";
  }

  sqlConnection(sql, (err, results) => {
    if (err) {
      res.send("Add resume reading fail");
    } else {
      if (results.length == 0) {
        res.send("User does not read yet");
      } else {
        res.send(results);
      }
    }
  });
});

//xóa toàn bộ resume reading
router.delete("/delete_all/user/:idUser", (req, res) => {
  let sql = "DELETE FROM resume_reading where user_idUser = ?;";
  sqlConnection(sql, [req.params.idUser], (err, results) => {
    if (err) {
      res.send("Delete all resume_reading fail");
    } else {
      if (results.length == 0) {
        res.send("User does not read yet");
      } else {
        res.send(results);
      }
    }
  });
});

module.exports = router;
