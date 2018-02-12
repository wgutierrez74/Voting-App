var path = process.cwd();
var Poll = require(path + "/app/models/polls.js");
var User = require(path + "/app/models/users.js");
var bCrypt = require('bcrypt-nodejs');




var methods = {};


methods.showAllPolls = function(req, res){
  	
  	Poll.find({}, function(err, polls){
		if(err){
		    console.log(err);
		    res.redirect("/home");
		}
		else{
			res.send(polls);
		}
	});
	
};


methods.showPoll = function(req, res){
        
    Poll.findOne({_id: req.params.query}, function(err, poll){
	   	if(err) throw err;
	   	var json={
	   		user: "",
	   		poll: poll
	   	}
	   	if(req.isAuthenticated()){
		   	json.user = req.user;
	   	}
	   	else{
	   		json.user = null;
	   	}
	   	console.log(json);
	   	res.send(json);
	});     
        
};


methods.createPoll = function(req, res){
  
  var newPoll = new Poll();
		newPoll.question = req.body.question;
		newPoll.user = req.user.email;
		newPoll.name = req.user.first_name;
		newPoll.options = [];
		for(var i = 0; i< req.body.options.length; i++){
			var json = {
			            option: req.body.options[i],
			            votes:0
		            };
		    newPoll.options.push(json);
		}

		newPoll.save(function(err, poll){
			if(err){
				console.log(err);
				res.render(path + "/public/create.ejs", {
	    			"message" : "Cannot have duplicate options"
	    		});
			}
			else{
				User.findOne({email: req.user.email}, function(err, user) {
				   if(err){
				   	console.log("Couldn't Find User");
				   	console.log(err);
				   	throw err;
				   }
				   console.log(poll);
				   user.polls_created.push({poll:poll.question, poll_id: String(poll._id)});
				   user.save(function(err){
				   		if(err){
				   			console.log("Couldn't update user");
				   			console.log(err);
				   		}
				   		res.redirect("/home");
				   });
				});
			}
		});
			
};


methods.deletePoll = function(req, res){
	//Check if user created poll, if so allow function to happen
	//If not dont, but POST should handle this problem
	Poll.remove({"_id": req.params.query}, function(err){
	   		if(err){
	   			res.render(path + "/public/home.ejs" ,{
	   				message : "Poll doesn't exist",
	   				user: req.user
	   			});
	   			console.log(err);
	   			//throw err;
	   		}
	   		else{
	   			User.findOne({email: req.user.email}, function(err, user) {
				   if(err){
				   	console.log("Cant find user");
				   	console.log(err);
				   	throw err;
				   }
				   for(var i = 0; i < user.polls_created.length; i++){
				   		console.log("Entered first for loop");
				   		if(user.polls_created[i].poll_id == req.params.query){
				   			user.polls_created.splice(i,1);
				   			break;
				   		}
				   }
				   for(var i = user.polls_voted.length-1 ; i>=0; i--){
				   		if(user.polls_voted[i].poll == req.params.query){
				   			user.polls_voted.splice(i, 1);
				   		}
				   }
				   User.findByIdAndUpdate(req.user._id, { $set : {polls_created:user.polls_created, polls_voted: user.polls_voted}}, function(err, updateUser){
				   		if(err){
				   			console.log("updating user error");
				   			console.log(err);
				   		}
				   		res.redirect("/home");
				   	});
				   
				});	
	   		}
	});
	
};

methods.saveOptionChoice = function(req, res){
	
	Poll.findOne({_id:req.body.poll._id}, function(err, poll) {
	    if(err){
	    	console.log(err);
	    }
	    for(var i = 0; i< poll.options.length; i++){
	    	if(poll.options[i].option == req.body.choice){
	    		poll.options[i].votes++;
	    		break;
	    	}
	    }
	    poll.save(function(err){
	    	if(err){
	    		console.log(err);
	    		res.send(err);
	    	}
	    	else{
	    		if(req.isAuthenticated()){
	    			User.findOne({email: req.user.email}, function(err, user){
		
						user.polls_voted.push({
							poll: req.body.poll._id,
							option_selected : req.body.choice
						});
						
						user.save(function(err){
							if(err){
								console.log(err);
								res.send(err);
							}
							else{
								res.redirect("/polls/get/"+ req.body.poll._id);
							}
						});
					});
	    		}
	    		else{
	    			res.redirect("/polls/get/"+ req.body.poll._id);
	    		}
	    	}
	    });
	});
	
};


methods.addNewOptions = function(req, res){
	Poll.findById(req.params.query, function(err, poll){
		if(err){
			console.log("Couldn't find poll");
			console.log(err);
		}	
		else{
			console.log("Before");
			console.log(poll.options);
			if(typeof req.body.newoptions == "object"){
				for(var i = 0; i < req.body.newoptions.length; i++){
					for(var j=0; j< poll.options.length; j++){
						if(poll.options[j].option == req.body.newoptions[i]){
							break;
						}
						if(j==poll.options.length-1){
							poll.options.push({option: req.body.newoptions[i], votes: 0});		
						}
					}
				}	
			}
			else{
				for(var i=0; i< poll.options.length; i++){
						if(poll.options[i].option == req.body.newoptions){
							break;
						}
						if(i==poll.options.length-1){
							poll.options.push({option: req.body.newoptions, votes: 0});		
						}
				}
			}
			console.log(poll.options);
			Poll.findByIdAndUpdate(req.params.query, {$set : {options: poll.options}}, function(err, results){
				if(err){
					console.log("Couldn't update");
					console.log(err);
					res.send(err);
				}
				else{
					res.redirect("/polls/get/"+req.params.query);
				}
			});
		}
	});
};

methods.showEjsPoll = function(req, res){
	 Poll.findOne({_id: req.params.query}, function(err, poll){
	   	if(err) throw err;
	   	if(req.isAuthenticated()){
	   			res.render(path + "/public/show.ejs", {
		   		user: req.user,
		   		poll : poll
		   	});	
	   	}
	   	else{
		   	res.render(path + "/public/show.ejs", {
		   		user: null,
		   		poll : poll
		   	});
	   	}
	});
};


methods.showdb = function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
			throw err;
		}
		Poll.find({}, function(err, polls){
			if(err){
				console.log(err);
				throw err;
			}
			var json = {
				Users : users,
				Polls : polls
			};
			res.send(json);
		});
	});	
};


methods.testdb = function(req, res){
	
	methods.deletedb(req, res);
	var newUser = new User();
	newUser.first_name = "Will";
	newUser.last_name = "G";
	newUser.email = "will@example.com";
	newUser.password = createHash("password");
	
	newUser.save(function(err){
		if(err){
			console.log(err);
			res.send(err);
		}
		var newPoll = new Poll();
		newPoll.question = "Who is better";
		newPoll.user = "will@example.com";
		newPoll.name = "Will";
		newPoll.options = [];
		var json = {
			option: "me",
			votes : 0
		};
		newPoll.options.push(json);
		var json2 = {
			option:"you",
			votes:0
		};
		newPoll.options.push(json2);
		newPoll.save(function(err){
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log("Great check it out");
				res.redirect("/polls");
			}
		});
	});
};


methods.dropIndexes = function(req, res){
	Poll.collection.dropIndexes(function (err, results) {
		if(err){
			console.log(err);
		}
		console.log(results);
	});
};



methods.deletedb = function(req, res){
	var mongoose = require('mongoose');
	mongoose.connection.dropDatabase();
	// Poll.collection.dropAllIndexes(function (err, results) {
 //   	if(err)
 //   		console.log(err);
	// });
	    
    // Poll.remove({}, function(err){
    // 	if(err) throw err;
    // });
    
    
    
    // User.remove({}, function(err){
    // 	if(err) throw err;
    // });  
};

var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = methods;