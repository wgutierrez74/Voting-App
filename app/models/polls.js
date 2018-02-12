'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var arrayUniquePlugin = require('mongoose-unique-array');

var Poll = new Schema({
		question: { type : String , required : true },
		user: { type : String , required : true },
		name: {type : String, required:true},
        options: [{option: {type:String, unique:true}, votes: Number, _id : false }],
  
});

Poll.plugin(arrayUniquePlugin);

module.exports = mongoose.model('Poll', Poll);
