'use strict';
var path = process.cwd();
var Users = require(path + '/app/models/users.js');

function SessionHandler () {

	this.getUser = function (req, res) {
		Users.findOne({'email': req.user.email }).exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};


}

module.exports = SessionHandler;
