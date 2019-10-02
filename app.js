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
});

//test data
app.get('/test', function(req, res){
    let student = {
        workshopId: 2,
        name: 'test',
        placeAvailable: 20
    };
    let sql = 'INSERT INTO workShop SET ?';
    let query = db.query(sql, student, function(err, result) {
        if(err) throw err;
        console.log(result);
    });
});

//get the skillSet list
app.get('/skillSet', urlencodedParser, function(req, res) {
    let sql = `SELECT * FROM skillSet;`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end({
            state: 'success!'
        });
    });
});

//get workshops typed by skillSet
app.post('/skillSet/workshopList', urlencodedParser, function(req, res) {
    let skillSetId = req.body.skillSetId;
    let sql = `SELECT * FROM workshop WHERE skillSetId = ${skillSetId}`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        res.end(JSON.stringify(result, null, 2));
    });
});

app.post('/bookedWorkshops', urlencodedParser, function(req, res) {
    let studentId = parseInt(req.body.studentId);
    console.log(studentId);
    let sql = `SELECT workShop.name FROM workShop INNER JOIN t_student_workShop ON t_student_workShop.workShopId=workShop.workShopId INNER JOIN student ON student.studentId=${studentId} and t_student_workShop.studentId = student.studentId;`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        console.log(JSON.stringify(result, null, 2));
        res.end(JSON.stringify(result, null, 2));
    });
});

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
    });
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
});

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
    });
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
});

//get the student information
app.post('/studentInformation', function (req, res) {
    console.log('student information: ' + req.body);
    let studentId = req.body.studentId;
    let response;
    let sql = `SELECT * FROM STUDENT WHERE studentId = "${studentId}";`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        response = result[0];
        console.log(response);
        res.end(JSON.stringify(response, null, 2));
    });
});

//login
app.post('/login', function (req, res) {
    console.log(req.body);
    var studentId = req.body.studentId;
    var password = req.body.password;
    var response;
    let sql = `SELECT * FROM STUDENT WHERE studentId = "${studentId}" and password = "${password}";`;
    let query = db.query(sql, function(err, result) {
        if(err) throw err;
        response = result[0];
        if(response != undefined) {
            res.end(JSON.stringify(response));
        } else {
            let student = {
                studentId: 0
            };
            res.end(JSON.stringify(student));
        }
    });
 });

var server = app.listen(8888, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("Server on http://%s:%s", host, port);
 
});