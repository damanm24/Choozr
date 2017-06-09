/**
 * Created by daman on 6/1/2017.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/choosr');

var PollSchema = mongoose.Schema({
    options: [{
        text: String,
        votes: Number,
        imageURL: String
    }]
});

var Poll = module.exports = mongoose.model('Poll', PollSchema);
