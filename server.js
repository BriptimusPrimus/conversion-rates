//server.js

var express = require('express');
var app = express();


//static files location
app.use(express.static(__dirname + '/public'));

app.get('/symbols', function(req,res){
    var symbolsMap = {
    	"USD" : "$",
    	"EUR" : "\u20AC", //"&euro;", €
    	"CAD" : "$",
    	"CNY" : "\u5143", // "元", //"\u00A5"=¥, 
    	"INR" : "\u20B9", //"₹" //&#8377;"
    	"MXN" : "$"
    }
	res.json(symbolsMap);	
});

app.get('/paypal/conversionRate', function(req,res){
    console.log("request to: "+req.url);
    console.log("params: convertFrom="+req.query.convertFrom+"&convertTo="+req.query.convertTo);
    res.json({conversionRate: 14.55});
});











app.listen(3000, function(){
	console.log("Server App listening on port 3000");
});