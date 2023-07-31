const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");
const fs = require("fs");

//show toàn bộ manga
router.get("/", (req, res) => {
    let sql = "select * from manga";
    sqlConnection(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//lấy random manga 
router.get("/random", (req, res) => {
    let sql = "call Manga_random();";
    sqlConnection(sql, (err, results) => {
        if (err) {
            res.send("Chapter or Manga not exist");
        } else {
            idManga = req.params.idManga;
            if (results.length == 0) {
                res.send("Chapter not exist");
            } else {
                res.send(results);
            }
        }
    });
});

//lấy random manga trong thể loại
router.get("/random/:genreName", (req, res) => {
    let sql = "call Manga_random_genre(?);";
    sqlConnection(sql, [req.params.genreName], (err, results) => {
        if (err) {
            res.send("Chapter or Manga not exist");
        } else {
            idManga = req.params.idManga;
            if (results.length == 0) {
                res.send("Chapter not exist");
            } else {
                res.send(results);
            }
        }
    });
});

//show thông tin manga theo id
router.get("/:idManga", (req, res) => {
    // lấy thông tin của manga
    let idManga = req.params.idManga;
    let sql = 'call Manga_get(?);'
    sqlConnection(sql, [idManga], (err, results) => {
        if (err) {
            res.send(false);
        } else {
            if (results.length == 0) {
                res.send("Manga not exist");
            } else {
                res.send(results);
            }
        }
    });
});

//show toàn bộ chapter trong manga
router.get("/:idManga/chapter", (req, res) => {
    let sql = "call Get_chapter(?)";
    sqlConnection(sql, [req.params.idManga], (err, results) => {
        if (err) {
            res.send("Chapter or Manga not exist");
        } else {
            idManga = req.params.idManga;
            if (results.length == 0) {
                res.send([]);
            } else {
                res.send(results);
            }
        }
    });
});

module.exports = router;
