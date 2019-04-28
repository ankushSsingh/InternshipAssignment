var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res) {
    var connection = req.db;
    //connection.query('SELECT * FROM userData', function(err, rows, fields) {
      //  res.render('userlist', {
        //    "userlist" : rows,
        //});
    });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var connection = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userPass = req.body.userpass;
    var userphone = req.body.userphone;
    var dt = Date();


    // We're not populating ID here because it should be auto-incrementing
    var newUser = { userName: userName, password: userPass, emailId: userEmail, phoneNo: userPhone,dateTime : dt }
    //alert('ee2e2');
    // Submit to the DB
    connection.query('INSERT INTO userData SET ?', newUser, function (error, results, fields) {
        if (error) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            //res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});
module.exports = router;
