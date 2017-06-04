/**
 * Created by daman on 6/1/2017.
 */
var express = require('express');
var router = express.Router();

var Poll = require('../models/Poll');
var User = require('../models/User');

router.post('/pollPost', function (req, res) {

    Poll.create(req.body, function (err, savedPoll) {
        if (err) throw err;

        res.json(savedPoll.id);
    });

});

router.get('/getPoll/:id', function (req, res) {
    Poll.findOne({_id: req.params.id}, function (err, foundPoll) {
        if (err) throw err;
        if (!foundPoll) {
            res.json('Cannot find the Poll with the given ID. It might have been deleted');
        } else {
            //console.log(foundPoll.id);
            if(hasVoted === true) {
                foundPoll.hasVoted = true;
            } else {
                foundPoll.hasVoted = false;
            }
            res.json(foundPoll);
        }
    });


});

router.put('/vote', function (req, res) {
    Poll.findOne({_id: req.body.poll_id}, function (err, foundPoll) {
        if (err) throw err;
        if (!foundPoll) {
            res.json('Cannot find the Poll with the given ID. It might have been deleted');
        } else {
            for (var i = 0; i < foundPoll.options.length; i++) {
                if (foundPoll.options[i].text === req.body.choice_text) {
                    foundPoll.options[i].votes++;
                    foundPoll.save(function (err, updatedPoll) {
                        if (err) throw err;

                        res.json(updatedPoll);
                    });
                    break;
                }
            }
        }
    });
});

router.get('/viewPolls', function (req, res) {
    Poll.find({}, function (err, foundPolls) {
        if (err) throw err;
        if (!foundPolls) {
            res.json('Cannot find the Poll with the given ID. It might have been deleted');
        } else {
            res.json(foundPolls);
        }
    });
});

module.exports = router;
