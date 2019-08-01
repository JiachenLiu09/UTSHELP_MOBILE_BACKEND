const express = require('express');
const mysql = require('mysql');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'uts_help'
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Mysql Connected');
})

//test data
app.get('/test', function(req, res){
    let student = {studentId: 12345678, firstName: "test", lastName: "test", password: "123456", email: "12345678@student.uts.edu.au"};
    let sql = 'INSERT INTO student SET ?';
    let query = db.query(sql, student, function(err, result) {
        if(err) throw err;
        console.log(result);
    })
})

//get the workshop list
app.get('/workshopList', function (req, res) {

    var response = {
        "data": [
            {
                "id": 1,
                "name": "Workshop_1",
                "description": "This 1st workshop."
            },
            {
                "id": 2,
                "name": "Workshop_2",
                "description": "This 2nd workshop."
            },
            {
                "id": 3,
                "name": "Workshop_3",
                "description": "This 3rd workshop."
            }
        ]
    };
     res.end(JSON.stringify(response))
 })
 

//  get the student information
app.post('/studentInformation', function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var response;
    let sql = `SELECT * FROM STUDENT WHERE email = "${email}";`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        response = result[0];
        console.log(response);
        res.end(JSON.stringify(response))
    })
})

//login
app.post('/login', function (req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var response;
    let sql = `SELECT * FROM STUDENT WHERE email = "${email}" and password = "${password}";`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        response = result[0];
        console.log(response);
        res.end(JSON.stringify(response))
    })
 })

var server = app.listen(8888, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Server on http://%s:%s", host, port)
 
})