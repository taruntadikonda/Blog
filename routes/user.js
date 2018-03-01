var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongodb=require('mongodb');
var app=express();

var userdata=[];
var usererror=[];
// User Schema
var Schema = mongoose.Schema;
var construct=new Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	img: { 
		data: Buffer,
		contentType: String 
	}
	
},{collection:'app3'});
var data=mongoose.model('data',construct);

data.find(function(err,doc)
{
	if(err)
	throw err;
	else
	{
		for(i=0;i<doc.length;i++)
		{
			userdata[i]=doc[i].username;
		}
		console.log(userdata);
	}
	
});

imageupload=function(img,err)
{
if(err)
{
	console.log(err);

}
else
{
	var insert=new data(img);
	insert.save();
}
}

checkuser=function(cb)
{
	console.log('1');
	
	data.find(cb)
}
getallusers=function(cb)
{
	data.find(cb);
}

getUserByUsername = function(username, callback){
	var query = {username: username};
	data.findOne(query, callback);
}

module.exports=getUserById = function(id, callback){    
	data.findById(id, callback);
}

comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
// Register
app.get('/register', function(req, res){
	res.render('register');
});

// Login
app.get('/login', function(req, res){
	res.render('login');
});

// Register User
app.post('/register', function(req, res){
	var a=0;
	//var usererror=[];
	console.log(userdata);
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	for(i=0;i<userdata.length;i++)
	{
		if(userdata[i]==username)
		{
			console.log('username already taken');
			a=1;
			usererror=[{msg:'username already taken try with other usernames'}];
			break;
		}
	}
	
	console.log('2');
	//console.log(userdata);
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    
	errors = req.validationErrors();
	
	
		
	if(errors || (a==1))
	{
		res.render('register',{
			errors:errors,usererror:usererror
		});
	} 
	else 
	{
		
		
		var item ={
			name: name,
			email:email,
			username: username,
			password: password
		};
		
		bcrypt.hash(item.password,10,function(err,hash)
  		{
    		if(err)
   			{
      			throw err;
    		}
    		else
    		{
      			item.password=hash;
      			//console.log(details.password);
				   
				  var insert= new data(item);

				  console.log('3');
				  console.log(item);

					userdata.push(item.username);
				  insert.save();
				  
					checkuser(function(err,doc)
					{			
					if(err)
						throw err;
					else
					{
						for(i=0;i<doc.length;i++)
						{
							userdata[i]=doc[i].username;
						}
						console.log(userdata);
					}
					});
    		}
 		});
		 
		 

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  getUserById(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
	  req.session.user=user;
    res.redirect('/');
  });

app.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = app;