const express = require('express');
const mysql = require('mysql');
var nodemailer = require('nodemailer');


var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
    let skillSet = {
        name: "workShop_1",
        placeAvailable: 20
    };
    let sql = 'INSERT INTO workShop SET ?';
    let query = db.query(sql, skillSet, function(err, result) {
        if(err) throw err;
        console.log(result);
    })
})

//get the skillSet list
app.get('/skillSet', urlencodedParser, function(req, res) {
    let sql = `SELECT * FROM skillSet;`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end({
            state: 'success!'
        });
    })
})

//get workshops typed by sillset
app.post('/skillSet/workshopList', urlencodedParser, function(req, res) {
    let skillSetId = req.body.skillSetId;
    let sql = `SELECT * FROM workshop WHERE skillSetId = ${skillSetId}`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end(JSON.stringify(result, null, 2));
    })
})

//book the workshop by current student
app.post('/book', urlencodedParser, function(req, res) {
    let studentId = req.body.studentId;
    let workshopId = req.body.workshopId;
    let sql = `
        INSERT INTO t_student_workShop values(${studentId}, ${workshopId});
        UPDATE workShop SET placeAvailable=placeAvailable-1 WHERE workShopId=${workshopId};
    `;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end(JSON.stringify(result, null, 2));
    })
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'liujiachen9702@gmail.com',
          pass: 'Liu152104'
       
        }
        });
        var mailOptions = {
          from: 'liujiachen9702@gmail.com',
          to: 'liujiachen9702@gmail.com',
          subject: 'Workshop Registration',
          text: `You(${studentId}) have booked this workshop successfully!`
        };
       
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
       
          console.log('Sending successfully');
        });
})

//cancel the workshop by current student
app.post('/cancel', urlencodedParser, function(req, res) {
    let studentId = req.body.studentId;
    let workshopId = req.body.workshopId;
    let sql = `
        DELETE FROM t_student_workShop WHERE workShopId=${workshopId} and studentId=${studentId};
        UPDATE workShop SET placeAvailable=placeAvailable+1 WHERE workShopId=${workshopId};
    `;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end(JSON.stringify(result, null, 2));
    })
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'liujiachen9702@gmail.com',
          pass: 'Liu152104'
       
        }
        });
        var mailOptions = {
          from: 'liujiachen9702@gmail.com',
          to: 'liujiachen9702@gmail.com',
          subject: 'Workshop Registration Cancel',
          text: `You(${studentId}) have canceled this workshop successfully!`
        };
       
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
       
          console.log('Sending successfully');
        });
})

//get the student information
app.post('/studentInformation', function (req, res) {
    console.log(req.body);
    let email = req.body.email;
    let response;
    let sql = `SELECT * FROM STUDENT WHERE email = "${email}";`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        response = result[0];
        console.log(response);
        res.end(JSON.stringify(response, null, 2))
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