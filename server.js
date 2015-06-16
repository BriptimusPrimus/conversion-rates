//server.js

var express = require('express');
var app = express();

var config = require('./config.js');
var curConv = require('./server/currencyConversion.js');
curConv.setConfiguration({
        source : config.source,
        mock: config.mock
});

//static files location
app.use(express.static(__dirname + '/public'));

app.get('/symbols', function(req,res){
    curConv.getCurrencySymbols(function(err, symbolsMap){
        if(err) 
            return res.status(500).end();

        console.log(symbolsMap);
        res.json(symbolsMap);
    })
});

app.get('/paypal/conversionRate', function(req,res){
    console.log("request to: "+req.url);
    console.log("params: convertFrom="+req.query.convertFrom+"&convertTo="+req.query.convertTo);
    curConv.getConversionRate(req.query.convertFrom, req.query.convertTo, function(err, result){
        if(err) 
            return res.status(500).end();

        console.log("conversionRate:"+result);
        res.json({conversionRate: result});
    });
});








app.listen(3000, function(){
	console.log("Server App listening on port 3000");
});