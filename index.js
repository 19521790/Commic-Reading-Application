const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const stripe = require('stripe')('sk_test_51KFt1gF2EZ3ThaNaIhBhZKtGvI02LpTE3JXSMAGvXkfdtYrhQl3tBYmbsCDvruGSiSKiB9nzNOwPbk216b886v2800Dn3iPopg');
//
app.post("/create-payment-intent", async (req, res) => {
    try {
        // const paymentIntent = await stripe.paymentIntent.create({
        //     amout: 1099,
        //     currency: "usd",
        //     payment_method_types: ["card"],
        // });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        const clientSecret = paymentIntent.client_secret;

        let sql = "update user set coin = coin + 100 where idUser=103288932652822225155;";
        sqlConnection(sql, (err, results) => {
            if (err) {
                res.send(false);
            } else {
                if (results.length == 0) {
                    res.send(false);
                } else {
                    res.json({
                        clientSecret: clientSecret
                    });
                }
            }
        });

    } catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
    }
})

app.use(
    cors({
        origin: "*",
    })
);

//lấy thông tin file json
app.use(express.json());

//dùng body-parser làm middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//link tĩnh
app.use("/m", express.static("manga"));
app.use("/g", express.static("genre"));

//lấy thông key publish vs scret Key
const postKey = require("./routes/Key")
app.use("/key", postKey)

//thể loại
const postGenre = require("./routes/Genre");
app.use("/genre", postGenre);

//manga
const postManga = require("./routes/Manga");
app.use("/manga", postManga);

//chapter
const postChapter = require("./routes/Chapter");
app.use("/chapter", postChapter);

//resume_reading
const postResumeReading = require("./routes/ResumeReading");
app.use("/resume_reading", postResumeReading);

//like
const postLike = require("./routes/Like");
app.use("/like", postLike);

//subscribe
const postSubscribe = require("./routes/Subscribe");
app.use("/subscribe", postSubscribe);

//read_later
const postReadLater = require("./routes/ReadLater");
app.use("/read_later", postReadLater);

//list title
const postList = require("./routes/ListTitle");
app.use("/list", postList);

//tìm kiếm
const postSearch = require("./routes/Search");
app.use("/search", postSearch);

//comment
const postComment = require("./routes/Comment");
app.use("/comment", postComment);

//user
const postUser = require("./routes/User");
app.use("/users", postUser);

//pay
const postMoney = require("./routes/Money");
const sqlConnection = require("./routes/sqlConnection");
app.use("/money", postMoney);

// const { default: Stripe } = require("../client/components/Stripe/Stripe");

app.listen(3000, () => {
    console.log("server is running on port 3000");
});