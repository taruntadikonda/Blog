var express = require('express');
var multer=require('multer');
var path=require('path');	
var mongo=require('mongodb');
var mongoose = require('mongoose');


var app = express.Router();
var id=require('./user');
// Get Homepage
var Schema1=mongoose.Schema;
var construct1=new Schema1(
	{
		title:{
			type:String
		},
		category:{
			type:String 
		},
		author:{
			type:String
		},
		problem:
		{
			type:String
		},
		body:{
			type:String
		},
		time:{
			type:String
		}
	},{collection:'app4'}
);

var data2=mongoose.model('data2',construct1);
module.exports=getdata=function(cb)
{
	data2.find(cb);
}

module.exports=getposts=function(post,cb)
{
	var query={author:post};
	data2.find(query,cb);
}


module.exports=putdata=function(see)
{
	var insert= new data2(see);
	insert.save();
}
module.exports=getcategory= function(category, callback){
	var query = {category: category};
	data2.find(query, callback);
}

module.exports=getid= function(id, callback){
	var query = {_id: id};
	data2.findOne(query, callback);
}

app.get('/', ensureAuthenticated, function(req, res)
{

	console.log(req.session.passport.user);
	var userid=req.session.passport.user;		
	getUserById(userid,function(err,doc)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			var title3=false;
			console.log(doc);
			var name=doc.name;
			var email=doc.email;
			getdata(function(err,docs)
			{
				res.render('index',{title1:name,title2:email,title:docs});
			});
				
  			
			  
		}
		
	});
	
	
	
//console.log(req.cookies);
//console.log("===============>>");

//console.log("================");

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}


}
app.get('/userlist',function(req,res)
{
	var userlist=[];
	var email=[];
	getallusers(function(err,doc)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			for(i=0;i<doc.length;i++)
			{
				
				userlist[i]={name:doc[i].username,email:doc[i].email};
			}
			//console.log(userlist);
			//console.log(email);
			res.render('userlist',{title:userlist});
		}
	});

	
});

module.exports = app;
