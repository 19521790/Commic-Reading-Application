const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");

//mua manga
//sau khi mua thì trừ tiền trong database và thêm manga và bảng đã trả
router.post("/buy", (req, res) => {
    let idChapter = req.body.idChapter;
    let idUser = req.body.idUser;
    let pay = req.body.pay;
    let sql = 'call Money_pay(?,?,?)';
    sqlConnection(sql, [idChapter, idUser, pay], (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

//lấy tiền từ database
router.get("/coin/:idUser", (req, res) => {
    let sql = 'select Coin from user where idUser =?;'
    sqlConnection(sql, [req.params.idUser], (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

//lấy thông tin chapter đã trả từ database
router.get("/get/:idUser", (req, res) => {
    let sql = 'select * from pay where user_idUser = ?;';
    sqlConnection(sql, [req.params.idUser], (err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
})

module.exports = router;