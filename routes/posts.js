var express = require('express');
var multer=require('multer');
var path=require('path');
var mongo=require('mongodb');
var mongoose = require('mongoose');
var see=require('./index');
var see1=require('./user');


var app = express.Router();


var Schema2=mongoose.Schema;
var construct2=new Schema2(
	{
		id:{
			type:String
		},
		comment:{
			type:String 
		},
		name:{
			type:String
		}

	},{collection:'app5'}
);

var data3=mongoose.model('data3',construct2);


putcomment=function(see)
{
	var insert= new data3(see);
	insert.save();
}

getcomment=function(comdata,cb)
{
    var query = {id: comdata};
	data3.find(query, cb);
    
}

app.get('/add',function(req,res)
{
    var usename=req.session.passport.user;
    console.log("user_id:"+usename);
    getauthor(usename,function(err,doc)
    {
        if(err)
        console.log(err)
        else{
            var author=doc.name;
            res.render('posts',{author:author});
        }
    });
    
});

app.post('/add',function(req,res)
{
    var title=req.body.title;
    var category=req.body.category;
    var author=req.body.author;
    var problem=req.body.problem;
    var body=req.body.text;
    var time=new Date();
    //console.log(title+" "+author+" "+time);

    req.checkBody('title', 'Title is Required').notEmpty();
	req.checkBody('category', 'Category is Required').notEmpty();
    req.checkBody('author', 'Author is Required').notEmpty();
    req.checkBody('text', 'Body is Required').notEmpty();
    errors = req.validationErrors();
    if(errors)
    {
        console.log(errors);
        res.render('posts',{errors:errors});
    }
    else
    {   
        var item={
            title:title,
            category:category,
            author:author,
            problem:problem,
            body:body,
            time:time

        };
        putdata(item);
        var noerror="submitted successfully";
        //console.log(noerror);
        res.render('posts',{noerror:noerror});
    }

    
});
app.get('/show/:id',function(req,res)
{
    var id=req.params.id;
    getid(id,function(err,docs)
    {
        if(err)
        console.log(err);
        else
        {
            var usename=req.session.passport.user;
            getUserById(usename,function(err,doc)
            {
                if(err)
                console.log(err);
                else
                {
                    console.log(doc.name);
                    var bodyid=docs.id;
                    console.log(bodyid);
                    getcomment(bodyid,function(err,comdata)
                    {
                        if(err)
                        console.log(err);
                        else
                        {
                        console.log(comdata);
                        res.render('id',{title:docs,name:doc.name,comdata:comdata});
                        }
                    })
                    
                    
                    
        
                }
            });

        }
        

    });
    
});
app.post('/show/comments',function(req,res)
{
    var comment=req.body.comment;
    var id=req.body.id;
    var name=req.body.name;
    var com={
        id:id,
        comment:comment,
        name:name
    };
    putcomment(com);
    console.log(comment+" "+id+" "+name);
    res.redirect(id);
});

module.exports = app;