/**
 * Created by daman on 6/3/2017.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/UserDB');


var UserSchema = mongoose.Schema({
    ip: String,
    poll_idS: [{
        id: String
    }]
});

var User = module.exports = mongoose.model('User', UserSchema);