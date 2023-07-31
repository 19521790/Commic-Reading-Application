const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");

router.get("/:word", (req, res) => {
  let word = req.params.word;
  let sql =
    "select idManga, Name, ImageAPI, Free, (select count(*) from chapter where manga_idManga = idManga)as Chapter from manga where Name like '%" +
    word +
    "%';";
  sqlConnection(sql, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      if (results.length == 0) {
        res.send(null);
      } else {
        res.send(results);
      }
    }
  });
});

module.exports = router;
