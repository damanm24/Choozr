var express = require('express');
var router = express.Router();

var User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
    var UserData = {
        ip: req.ip,
        poll_id: ["First"]
    };
    User.find({ip: req.ip}, function(err, foundUser) {
        if(foundUser == null) {
            User.create(UserData, function(err, savedUser) {
                if(err) console.log(err);
                console.log(savedUser);
            });
        }
    });
    res.sendFile(path.join(__dirname, 'views') + '/index.html');
});

module.exports = router;
