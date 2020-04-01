/*
// eslint-disable-next-line no-undef
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})*/

/*
var express = require('express');
var app = express();

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
    console.log("Got a GET request for /list_user");
    res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})*/
var express = require('express');
const url = require('url');
var app = express();

app.set("view engine","ejs");

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: '3306',
    user: "oslo",
    password: "oslo",
    database: "example_db"
});

function getEventsForPeriod(start, end, callback) {
    var sql = "SELECT event_date.Date, event.Name, event.Type,Location.location_name"
        + " FROM event_date, event, location"
        +
        " WHERE event_date.Event_id = event.Event_id and event.location_Location_id = Location.Location_id"
        + " and event_date.Date >= ? and event_date.Date <= ?"
        + " GROUP BY Name"
        + " ORDER BY event_date.Date";

    con.query(sql, [start, end], callback);
}

app.get('/', function (req, res) {
    var q = url.parse(req.url, true).query;
    var startDate = q.start || '2019-01-01';
    var endDate = q.end || '2020-01-01';

    getEventsForPeriod(startDate, endDate, function(err, events) {
        if (err) {
            res.send(err);
            return;
        }
        console.log(events);
        res.render('pages/index', {
            events,
            startDate,
            endDate
        });
    })
})

var server = app.listen(8081, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port

    console.log(server.address())
    console.log(port)

    console.log("Example app listening at http://%s:%s", host, port)
})

