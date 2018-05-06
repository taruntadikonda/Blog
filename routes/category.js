var express = require('express');
var multer=require('multer');
var path=require('path');
var mongo=require('mongodb');
var mongoose = require('mongoose');
var app = express.Router();
var see=require('./index');

app.get('/show',function(req,res)
{
    var catdata=[];
    var final=[];
    getdata(function(err,doc)
    {
    if(err)
    console.log(err);
    else
    {

        for(i=0;i<doc.length;i++)
        {
            catdata[i]=doc[i].category;
        }
        var filteredArr = catdata.filter(function(item, index) {
            if (catdata.indexOf(item) == index)
              return item;
          });
          res.render('category',{title:filteredArr});
    }
    
    });
    
});

app.get('/show/:category',function(req,res)
{
    var cat=req.params.category;
    
    console.log(cat);
    getcategory(cat,function(err,docs)
    {
        if(err)
        console.log(err);
        else
        {
            
            console.log(docs);
            res.render('cat',{pushcat:docs});
        }
    });

    
});




module.exports = app;