/*
//Testing express connection
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
//Testing express connection 2
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

/*
var mysql = require('mysql');
var http = require('http');
var db = null;

http.createServer(router).listen(8080);
console.log('Server running on port 8080.');

function getConnection() {
    if (db === null) {
        db = mysql.createPool(getConfig())
    }
    return db;
}

function getConfig() {
    return {
        host: "localhost",
        user: "olso",
        password: "olso",
        database: "example_db"
    };
}

function router(req, res) {
    getConnection().query('select * from event;', function (error, result, fields) {
        if (error) {
            throw error;
        }
        console.log(result);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(result));
    });
}*/

// tehtävä 6

var http = require('http');
http.createServer(router).listen(8080);
console.log('Server running on port 8080.');

async function router () {
    const mysql = require('mysql');
    var conn = mysql.createConnection({
        host: "localhost",
        user: "olso",
        password: "olso",
        database: "example_db"
    })
    try{
        await new Promise ((req, res) =>{
            conn.query('select * from event;', function (error, result, fields){
                if (error) {
                    throw error;
                }
                console.log(result);
            })
        })
    }catch (err) {
        throw err;
    }finally {
        await conn.end();
    }
}


