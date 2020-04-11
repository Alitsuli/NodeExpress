
var express = require('express');
var app = express();
var url = require('url');
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "olso",
    password: "olso",
    database: "example_db"
});

app.get("/api/location", function (req, res) {
    console.log("get location details");
    var q = url.parse(req.url, true).query;
    var nimi = q.name;
    var sql = "SELECT * from location WHERE Location_name = ?";
    con.query(sql, [nimi], function (err, result){
         if (err)
             throw (err);
         else
             console.log(result);
             res.end(JSON.stringify(result));
    })
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});