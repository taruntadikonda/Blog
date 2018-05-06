var express = require('express');
var multer=require('multer');
var path=require('path');
var db=require('monk')('localhost:27017/blog');

var app = express.Router();
var id=require('./user');
/*
var storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cd){
        cd(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:storage
}).single('upload');
*/

var data=db.get('post');
// Get Homepage
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
			res.render('index',{title1:name,title2:email});	
  			
			  
		}
		
	});
	
	
	
console.log(req.cookies);
console.log("===============>>");

console.log("================");

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
			console.log(userlist);
			console.log(email);
			res.render('userlist',{title:userlist});
		}
	});

	
});
app.get('/posts',function(req,res)
{
	res.render('posts');

});

app.get('/cat',function(req,res)
{
	res.render('cat');
});

module.exports = app;
