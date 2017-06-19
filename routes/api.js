/**
 * Created by daman on 6/1/2017.
 */
var express = require('express');
var router = express.Router();

var Poll = require('../models/Poll');
var User = require('../models/User');

router.post('/pollPost', function(req, res) {

  Poll.create(req.body, function(err, savedPoll) {
    if (err) throw err;

    res.json(savedPoll.id);
  });

});

router.get('/getPoll/:id', function(req, res) {
  console.log("HERE");
  Poll.findOne({
    _id: req.params.id
  }, function(err, foundPoll) {
    if (err) throw err;
    if (!foundPoll) {
      res.status(304).send('Cannot find the Poll with the given ID. It might have been deleted');
    } else {
      console.log(foundPoll.id);
      res.json(foundPoll);
    }
  });


});

router.put('/vote', function(req, res) {
  Poll.findOne({
    _id: req.body.poll_id
  }, function(err, foundPoll) {
    if (err) throw err;
    if (!foundPoll) {
      res.status(404).send('Cannot find the Poll with the given ID. It might have been deleted');
    } else {
      for (var i = 0; i < foundPoll.options.length; i++) {
        if (foundPoll.options[i].text === req.body.choice_text) {
          foundPoll.options[i].votes++;
          foundPoll.save(function(err, updatedPoll) {
            if (err) throw err;

            res.json(updatedPoll);
          });
          break;
        }
      }
    }
  });
});

router.get('/getPolls', function(req, res) {
  Poll.find({}, function(err, foundPolls) {
    if (err) throw err;
    if (!foundPolls) {
      res.status(404).send('Cannot find any polls');
    } else {
      res.json(foundPolls);
    }
  });
});

router.get('/lazyLoad', function(req, res) {
  Poll.find({})
    .sort({
      "_id": -1
    })
    .limit(15)
    .exec(function(err, docs) {
      if(err) throw err;
      docs.lastSeen = docs.slice(-1).id;
      res.json(docs);
    });
});

router.get('/nextIncrement/:lastSeen', function(req, res) {
  User.find({ "_id": { "$lt": req.params.lastSeen })
    .sort({ "_id": -1 })
    .limit(15)
    .exec(function(err,docs) {
        if(err) throw err;
        docs.lastSeen = docs.slice(-1).id;
        res.json(docs);
    });
});

router.delete('/deletePoll/:id', function(req, res) {
  Poll.remove({
    _id: req.params.id
  }, function(err, foundPoll) {
    if (err) throw err;
    if (!foundPoll) {
      res.status(404).send('Error in deleting poll, check ID');
    } else {
      res.json('Success in deleting poll');
    }
  })
});

router.put('/updatePoll/:id', function(req, res) {
  Poll.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPoll) {
    if (err) throw err;
    if (!updatedPoll) {
      res.status(304).send('Error in updating poll, check ID');
    } else {
      res.json(updatedPoll);
    }
  })
});

module.exports = router;
