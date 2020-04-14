
var express = require('express');
var app = express();
var url = require('url');
var mysql = require("mysql");

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});

var con = mysql.createConnection({
    host: "localhost",
    user: "olso",
    password: "olso",
    database: "example_db"
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/api/events", function (req, res) {
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

var locationId = [];
var eventId = [];
app.post("/api/events", async function (req,res) {
    /***
     * test post
    console.log("body: %j", req.body);
    console.log(req.body.data);
    */

    let data = req.body;

    con.query("SELECT location.Location_id FROM location;", function (err, result) {
        if(err)
            throw err;
        else
            eventId = result;
            if(locationId.length< data.eventLocation) {
                console.log("Tapahtuma sijainti ei ole db:ssä");

                let sql = "INSERT INTO location (Location_id, Location_name, Street_address, City, Zip, Country) VALUES (?, ?, ?, ?, ?, ?)";
                con.query(sql, [data.eventLocation, data.locName, data.locStreetAddress, data.locCity, data.locZip, data.locCountry], function (err, result) {
                    if (err)
                        throw err;
                    else
                        console.log(result + "Paikka on lisätty");

                    sql = "INSERT INTO event (Event_id, Name, Type,Location_Location_id) VALUES (?, ?, ?, ?)";
                    con.query(sql, [(eventId.length + 1), data.eventName, data.eventType, data.eventLocation], function (err, result) {
                        if (err)
                            throw err;
                        else
                            console.log(result + "Tapahtuma on lisätty");
                        sql = "INSERT INTO event_date (Date, Event_id) VALUES (?, ?)";
                    });
                });

                res.send("lisätty!");
            }else{
                console.log("Tapahtuma sijainti on db:ssä");
                let sql = "INSERT INTO event (Event_id, Name, Type, Location_Location_id) VALUES (?, ?, ?, ?)";

                con.query(sql, [(eventId.length+1), data.eventName, data.eventType,data.eventLocation], function(err, result){
                    if (err)
                        throw err;
                    else
                        console.log(result + "Test 3");

                    sql = "INSERT INTO event_date (Date, Event_id) VALUES (?, ?)";
                });

                res.send("OK");
            }
    });
});



app.use(bodyParser.urlencoded({
    extended: false }));
app.use(bodyParser.json()); // for reading JSON
