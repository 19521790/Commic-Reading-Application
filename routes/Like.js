const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");

//kiểm tra likes có tồn tại không
router.get("/check/:idUser&:idManga", (req, res) => {
    let sql =
        "select exists(select * from likes where user_idUser = ? and manga_idManga = ?) as exist;";
    sqlConnection(
        sql,
        [req.params.idUser, req.params.idManga],
        (err, results) => {
            if (err) {
                res.send(err);
            } else {
                if (results.length == 0) {
                    res.send("something went wrong");
                } else {
                    res.send(results);
                }
            }
        }
    );
});

//lấy like từ database
router.get("/user/:idUser", (req, res) => {
    let sql =
        "select user_idUser as idUser, idManga, Name, ImageAPI, date_added, Free,(select count(*) from chapter where manga_idManga = idManga) as chapter from likes join manga on likes.manga_idManga = manga.idManga where user_idUser = ?";
    sqlConnection(sql, [req.params.idUser], (err, results) => {
        if (err) {
            res.send("User not exist");
        } else {
            if (results.length == 0) {
                res.send([]);
            } else {
                res.send(results);
            }
        }
    });
});

//thêm like vào database
router.post("/add", (req, res) => {
    let idManga = req.body.idManga;
    let idUser = req.body.idUser;
    let date_added = Date.now();
    let sql = "call Add_likes(?,?,?)";

    sqlConnection(sql, [idUser, idManga, date_added], (err, results) => {
        if (err) {
            res.send("Add like failed");
        } else {
            res.send(results);
        }
    });
});

//xóa like khỏi database
router.delete("/delete", (req, res) => {
    let idManga = req.body.idManga;
    let idUser = req.body.idUser;

    let sql = "delete from likes where user_idUser = ? and manga_idManga = ?;";

    sqlConnection(sql, [idUser, idManga], (err, results) => {
        if (err) {
            res.send("Delete like failed");
        } else {
            res.send(results);
        }
    });
});

module.exports = router;
