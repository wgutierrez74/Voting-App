'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var arrayUniquePlugin = require('mongoose-unique-array');
//Unique polls
var User = new Schema({
		first_name: { type : String , required : true },
		last_name: { type : String , required : true },
		email:  { type : String , unique : true, required : true },
		password: { type : String , required : true },
        polls_created: [{poll:String, poll_id:String, }],
        polls_voted: [{poll: String,option_selected: String}]

});

User.plugin(arrayUniquePlugin);

module.exports = mongoose.model('User', User);
