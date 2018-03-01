var express = require('express');
var multer=require('multer');
var path=require('path');

var app = express.Router();
var id=require('./user');

var storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cd){
        cd(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:storage
}).single('upload');

var data={};
// Get Homepage
app.get('/', ensureAuthenticated, function(req, res){
	
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
			console.log(doc);
			var name=doc.name;
			var email=doc.email;
			res.render('index',{title1:name,title2:email});  
		}
	});
	console.log(data);
	
	
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
				userlist[i]=doc[i].username;
			}
			console.log(userlist);
			res.render('userlist',{title:userlist});
		}
	});

	
});
app.post('/upload',function(req,res)
{
	upload(req,res,function(err)
	{
    if(err)
    {
        console.log(err);
    }
    else{
		console.log(req.file);
		img=req.file;
		imageupload(img);
        res.redirect('/');
    }
});

});

module.exports = app;
