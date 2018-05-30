
var express=require('express');
var app=express.Router();
var id=require('./user');
var see=require('./index');
var see1=require('./posts');

app.get('/',function(req,res)
{
    
    var userid=req.session.passport.user;
    getUserById(userid,function(err,doc)
    {
        if(err)
        console.log(err)
        else
        {
		console.log(doc);
            var name=doc.name;
            getposts(name,function(err,docs)
            {
                if(err)
                console.log(err);
                else
                {
	
                    console.log(docs.id);
                    res.render('question',{title:docs});
                    
                    
                       
                    
                }
            })
        }
    })
});



module.exports=app;
