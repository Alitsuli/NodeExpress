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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/events", function (req, res) {
    console.log("get events ");
    var q = url.parse(req.url, true).query;
    var startDate = q.start;
    var endDate = q.end;
    var sql = "SELECT event_date.Date, event.Name, event.Type, Location.Location_name" +
        " FROM event_date, event, location" +
        " WHERE event_date.Event_id = event.Event_id and event.Location_Location_id = Location.Location_id" +
        " and event_date.Date >= ? and event_date.Date <= ?" + " GROUP BY Name" + " ORDER BY event_date.Date";
    con.query(sql, [startDate, endDate], function (err, result) {
        if (err)
            throw (err);
        else{
            console.log(result);
            res.send(JSON.stringify(result));
        }
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});