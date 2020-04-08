//sql server
var express = require('express');
var app = express();
var url = require('url');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');

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

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
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

//get all location
app.get("/location", function (req, res) {
    console.log("get location details");
    con.query('SELECT * FROM location', function(error, result, fields) {
        if (err)
            throw (err);
        else{
            console.log(result);
            res.end(JSON.stringify(result));

        }
    })
});

app.post('/api/event', async function (req,res) {
    let data = req.body;

    var usedLocIds = [];
    var usedEventIds = [];

    function replaceHyph(myStr){
        return myStr.replace(/-/g, "");
    }
    db.query("SELECT location.Location_id FROM location;", function(err, result){
        if (err) throw err;
        usedLocIds = result;
        db.query("SELECT event.Event_id FROM event;", function (err, result){
            if (err) throw err;
            usedEventIds = result;

            if(usedLocIds.length < data.eventLocation) {
                console.log("Event location not in db");

                let sql = "INSERT INTO location (Location_id, Location_name, Street_address, City, Zip, Country) VALUES (?, ?, ?, ?, ?, ?)";

                db.query(sql,[data.eventLocation, data.locName, data.locStreetAddress, data.locCity, data.locZip, data.locCountry], function(err, result){
                    if (err) throw err;

                    sql = "INSERT INTO event (Event_id, Name, Type, Location_Location_id) VALUES (?, ?, ?, ?)";

                    db.query(sql, [(usedEventIds.length+1), data.eventName, data.eventType,data.eventLocation], function(err, result){
                        if (err) throw err;

                        sql = "INSERT INTO event_date (Date, Event_id) VALUES (?, ?)";

                        db.query(sql, [replaceHyph(data.eventDate), (usedEventIds.length+1)], function(err, result){
                            if (err) throw err;
                        });
                    });
                });

                res.send("OK");

            }else{
                console.log("Event location already in db");

                let sql = "INSERT INTO event (Event_id, Name, Type, Location_Location_id) VALUES (?, ?, ?, ?)";

                db.query(sql, [(usedEventIds.length+1), data.eventName, data.eventType, data.eventLocation], function(err, result){
                    if (err) throw err;

                    sql = "INSERT INTO event_date (Date, Event_id) VALUES (?, ?)";

                    db.query(sql, [replaceHyph(data.eventDate), (usedEventIds.length+1)], function(err, result){
                        if (err) throw err;
                    });
                });

                res.send("OK");
            }

        });
    });
});