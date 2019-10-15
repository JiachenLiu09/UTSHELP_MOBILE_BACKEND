const express = require('express');
const mysql = require('mysql');
var nodemailer = require('nodemailer');


var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const db = mysql.createConnection({
    host: 'utshelpdb.cvdpbjinsegf.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'thisadmin',
    database: 'uts_help',
    multipleStatements: true
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Mysql Connected');
});

app.get('/workshops', urlencodedParser, function(req, res) {
    let sql = `SELECT * FROM workShop;`;
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        res.end(JSON.stringify(result, null, 2));
    });
});

app.post('/workshopDetail', urlencodedParser, function(req, res) {
    let workshopId = req.body.workshopId;
    let sql = `SELECT * FROM workShop WHERE workShopId=${workshopId}`
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        response = result[0];
        res.end(JSON.stringify(response, null, 2));
    })
})

app.post('/skillSet', urlencodedParser, function(req, res) {
    let skillSetId = req.body.skillSetId;
    let sql = `SELECT * FROM skillSet WHERE skillSetId=${skillSetId}`
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        response = result[0];
        res.end(JSON.stringify(response, null, 2));
    })
})

app.post('/room', urlencodedParser, function(req, res) {
    let roomId = req.body.roomId;
    let sql = `SELECT * FROM room WHERE roomId=${roomId}`
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        response = result[0];
        res.end(JSON.stringify(response, null, 2));
    })
})

app.post('/bookedWorkshops', urlencodedParser, function(req, res) {
    let studentId = parseInt(req.body.studentId);
    console.log(studentId);
    let sql = `SELECT * FROM workShop INNER JOIN t_student_workShop ON t_student_workShop.workShopId=workShop.workShopId INNER JOIN student ON student.studentId=${studentId} and t_student_workShop.studentId = student.studentId;`;
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        console.log(JSON.stringify(result, null, 2));
        res.end(JSON.stringify(result, null, 2));
    });
});

app.post('/sessions', urlencodedParser, function(req, res) {
    let studentId = parseInt(req.body.studentId);
    console.log(studentId);
    let sql = `SELECT * FROM session where studentId=${studentId};`;
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
        console.log(JSON.stringify(result, null, 2));
        res.end(JSON.stringify(result, null, 2));
    });
});

app.post('/book', urlencodedParser, function(req, res) {
    let studentId = req.body.studentId;
    let workshopId = req.body.workshopId;
    let successInf = {
        inf: 'success'
    };
    let failInf = {
        inf: 'fail'
    }
    let sql = `
        INSERT INTO t_student_workShop values(${studentId}, ${workshopId});UPDATE workShop SET placeAvailable=placeAvailable-1 WHERE workShopId=${workshopId};
    `;
    console.log(studentId)
    let query = db.query(sql, function(err, result) {
        if(err) {
            res.end(JSON.stringify(failInf))
            console.log("book success")
        } else {
            res.end(JSON.stringify(successInf));
        }
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
        DELETE FROM t_student_workShop WHERE workShopId=${workshopId} and studentId=${studentId};UPDATE workShop SET placeAvailable=placeAvailable+1 WHERE workShopId=${workshopId};
    `;
    let successInf = {
        inf: 'success'
    };
    let failInf = {
        inf: 'fail'
    }
    let query = db.query(sql, function(err, result) {
        if(err) {
            res.end(JSON.stringify(failInf))
        } else {
            res.end(JSON.stringify(successInf));
        }
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
    let sql = `SELECT * FROM student WHERE studentId = "${studentId}";`;
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
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
    let sql = `SELECT * FROM student WHERE studentId = "${studentId}" and password = "${password}";`;
    let query = db.query(sql, function(err, result) {
        if(err) console.log(err);
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

 //show profile
 app.post('/studentProfile', function(req, res) {
    var studentId = req.body.studentId;
    let sql = `SELECT * FROM studentProfile where studentId=${studentId}`;
    db.query(sql, function(err, result) {
        if(err) console.log(err);
        response = result[0];
        console.log(response);
        res.end(JSON.stringify(response, null, 2));
    })
 })

 app.post('/updateProfile', function(req, res) {
    var profileId = req.body.profileId;
    var preferredFirstName = req.body.preferredFirstName;
    var degree = req.body.degree;
    var year = req.body.year;
    var status = req.body.status;
    var firstLanguage = req.body.firstLanguage;
    var countryOfOrigin = req.body.countryOfOrigin;
    let sql = `
            UPDATE studentProfile SET preferredFirstName="${preferredFirstName}",degree="${degree}",year="${year}",status="${status}",firstLanguage="${firstLanguage}",countryOfOrigin="${countryOfOrigin}" WHERE profileId=${profileId}
            `;
    let successInf = {
        inf: 'success'
    };
    let failInf = {
        inf: 'fail'
    }
    db.query(sql, function(err, result) {
        if(err) {
            res.end(JSON.stringify(failInf));
            console.log(err);
        } else {
            res.end(JSON.stringify(successInf));
        }
    })
 })

var server = app.listen(8888, function () {
 
  var host = server.address().address;
  var port = server.address().port;
 
  console.log("Server on http://%s:%s", host, port);
 
});