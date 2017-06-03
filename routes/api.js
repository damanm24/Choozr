/**
 * Created by daman on 6/1/2017.
 */
var express = require('express');
var router = express.Router();

var Poll = require('../models/Poll');

router.post('/pollPost', function(req, res) {

    Poll.create(req.body, function(err, savedPoll) {
        if(err) throw err;

        res.json(savedPoll.id);
    });

});

router.get('/getPoll/:id', function(req, res) {
    console.log(req.params.id);
    Poll.findOne({id: req.params.id}, function(err, foundPoll) {
        if(err) throw err;
        if(!foundPoll) {
            res.json('Cannot find the Poll with the given ID. It might have been deleted');
        } else {
            res.json(foundPoll);
        }
    });


});

module.exports = router;