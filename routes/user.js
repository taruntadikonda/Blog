var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongodb=require('mongodb');
var nodemailer=require('nodemailer');
var app=express();


var verificationcode;
var passwordemail;
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
	}
	
	
},{collection:'app3'});
//new schema
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

module.exports=getauthor=function(id,cb)
{
	var query={_id:id};
	data.findOne(query,cb);
}

getUserByUsername = function(username, callback){
	var query = {username: username};
	data.findOne(query, callback);
}

updatepassword=function(oldpassword,newpassword,cb){
	var query1={password:oldpassword};
	var query2={$set:{password:newpassword}};
	data.updateOne(query1,query2,cb);
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

app.post('/verify',function(req,res){
	var a=0;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	console.log(name+email+username+password+password2);

	verificationcode=Math.floor(100000 + Math.random() * 900000);
	console.log(verificationcode);
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
			res.render('register',{errors:errors,usererror:usererror});
			
								
		}
		else
		{
		//mail the verification code and get conformed
		var sender=nodemailer.createTransport({
			service:'Gmail',
			auth:{
				user:'taruntadikonda@gmail.com',
				pass:'bujjibangaram'
			}
		});
		var maildetails={
			from:'tarun tadikonda <taruntadikonda@gmail.com>',
			to:email,
			subject:'submission',
			text:'The verification code is : '+ verificationcode
		};
		sender.sendMail(maildetails,function(error,info)
			{
				if(error)
				{
					console.log("error is"+error);
					

				}
				else
				{
					console.log("done submissin"+info);
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
							//console.log(userdata);
						}
						});
					
				}
			})

		



			res.render('verify',{'name':name,'username':username,'email':email,'password':password,'password2':password2});
	}
	
})

// Login
app.get('/login', function(req, res){
	res.render('login');
});

// Register User
app.post('/register', function(req, res){
	
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var verify = req.body.verificationcode;
	//console.log(name+email+username+password);
	if(verify==verificationcode){
		console.log('verification done');
		var item ={
			name: name,
			email:email,
			username: username,
			password: password
		};
		console.log(item);
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

				  //console.log('3');
				  //console.log(item);

				  userdata.push(item.username);
				  insert.save();
				  req.flash('success_msg', 'You are registered and can now login');
				  res.redirect('/users/register');
					
    		}
 		});
		
	}
	 else{
		 //eror throwback
		 console.log('error in verifiaction');
		 req.flash('success_msg', 'error in verification');
				  res.redirect('/users/register');
	 }
	
});
app.get('/forgetpassword',function(req,res){
	res.render('forgetpassword');
});

app.post('/passwordemailverify',function(req,res){
	var email=req.body.email;
	passwordemail=Math.floor(100000 + Math.random() * 900000);
	var sender=nodemailer.createTransport({
		service:'Gmail',
		auth:{
			user:'taruntadikonda@gmail.com',
			pass:'bujjibangaram'
		}
	});
	var maildetails={
		from:'tarun tadikonda <taruntadikonda@gmail.com>',
		to:email,
		subject:'forget password',
		text:'The verification code is : '+ passwordemail
	};

	sender.sendMail(maildetails,function(error,info){
		if(error){
			console.log(error);
		}else{
			console.log('mail sent');	
		}
	});
	res.render('emailcheck',{'email':email});
});

app.post('/passwordchange',function(req,res)
{
	var enteredverificationcode=req.body.code;
	var password=req.body.password;
	var conformpassword=req.body.conformpassword;
	var username=req.body.username;
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('conformpassword', 'Passwords do not match').equals(req.body.password);

    
	errors = req.validationErrors();
	if(enteredverificationcode==passwordemail && !errors)
	{
		
	
		console.log('done verification');
		getUserByUsername(username,function(err,userdata){
		if(!err && userdata)
		{
			console.log(userdata);
			bcrypt.hash(password,10,function(err,hash){
				if(!err){
					password=hash;
					console.log(password);
					updatepassword(userdata.password,password,function(err,response){
						if(!err){
							console.log(response);
							req.flash('success_msg', 'password changed sussecufully');
							res.redirect('/users/login');
						}else{
							console.log(err);
							req.flash('success_msg', 'error in verification');
						res.redirect('/users/login');
						}
					})
					
				}else{
					req.flash('success_msg', 'error in verification');
					res.redirect('/users/login');	
				}
			})

			
		}
		else
		{
			//log the error
			req.flash('success_msg', 'error in verification');
			res.redirect('/users/login');
		}	
		
		});
	


	}
	else
	{
		req.flash('success_msg', 'error in verification');
		res.redirect('/users/login');
	}
	
})


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