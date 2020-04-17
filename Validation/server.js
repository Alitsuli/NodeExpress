var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/process_post', urlencodedParser,
    [check('first_name').isLength({ min: 2 }).withMessage("vähintään kaksimerkkiä!"),
        check('last_name').isLength({ min: 2 }).withMessage("vähintään kaksimerkkiä!"),
        check('age').isNumeric({no_symbols:true}).withMessage("Kerro ikäsi numeroina!"),
        check('email').isEmail().withMessage("esim => example@example.com!")],

    function (req, res) {
    // Prepare output in JSON format
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()});
            }
    response = {
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        age:req.body.age,
        email:req.body.email
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})