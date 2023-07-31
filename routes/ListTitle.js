const express = require("express");
const router = express.Router();
const sqlConnection = require("./sqlConnection");

//new title for you
//lấy theo DateAdded
router.get("/new_title", (req, res) => {
    let sql = 'call List_new_title_for_you()';
    sqlConnection(sql, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            if (results.length == 0) {
                res.send('No manga available');
            } else {
                res.send(results);
            }
        }
    });
})

//top pick for you
//lấy theo WeekView
router.get("/top_pick", (req, res) => {
    let sql = 'call List_top_pick_for_you()';
    sqlConnection(sql, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            if (results.length == 0) {
                res.send('No manga available');
            } else {
                res.send(results);
            }
        }
    });
})

//New & Noteworthy
//Lấy theo có New và WeekView
router.get("/new_noteworthy", (req, res) => {
    let sql = 'call List_new_noteworthy()';
    sqlConnection(sql, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            if (results.length == 0) {
                res.send('No manga available');
            } else {
                res.send(results);
            }
        }
    });
})

module.exports = router