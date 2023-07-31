const mysql = require("mysql");

config = {
  host: "eu-cdbr-west-02.cleardb.net",
  user: "b6fa9be5b60652",
  password: "8fdd1a93",
  database: "heroku_18906e98f1e20f7",
  multipleStatements: true,
};

var sqlConnection = function sqlConnection(sql, values, next) {
  // It means that the values hasnt been passed
  if (arguments.length === 2) {
    next = values;
    values = null;
  }

  var connection = mysql.createConnection(config);
  connection.connect(function (err) {
    if (err !== null) {
      console.log("[MYSQL] Error connecting to mysql:" + err + "\n");
    }
  });

  connection.query(sql, values, function (err) {
    connection.end(); // close the connection

    if (err) {
      throw err;
    }

    // Execute the callback
    next.apply(this, arguments);
  });
};

module.exports = sqlConnection;
