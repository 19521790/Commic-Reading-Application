const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");

//thêm comment vào database
router.post("/add", (req, res) => {
  let sql =
    "insert into comment (user_idUser, manga_idManga, content) values (?,?,?)";
  let idUser = req.body.idUser;
  let idManga = req.body.idManga;
  let comment = req.body.comment;
  sqlConnection(sql, [idUser, idManga, comment], (err, results) => {
    if (err) {
      res.send(err);
    } else {
      if (results.length == 0) {
        res.send("No manga available");
      } else {
        res.send(results);
      }
    }
  });
});

//lấy comment từ database
router.get("/get/:idManga", (req, res) => {
  let sql =
    "select idComment, idUser, content, Email, Image, Name from comment join user on comment.user_idUser = user.idUser where manga_idManga = ?";
  sqlConnection(sql, [req.params.idManga], (err, results) => {
    if (err) {
      res.send(err);
    } else {
      if (results.length == 0) {
        res.send([]);
      } else {
        res.send(results);
      }
    }
  });
});

module.exports = router;
