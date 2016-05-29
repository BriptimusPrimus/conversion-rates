//server.js

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser('my secret here'));

var config = require('./config.js');
var curConv = require('./server/currencyConversion.js');
curConv.setConfiguration({
        source : config.source,
        mock: config.mock
});

//static files location
app.use(express.static(__dirname + '/public'));

// Allow CORS
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// /symbols
app.get('/symbols', function(req, res){
    console.log("request to: "+req.url);
    curConv.getCurrencySymbols(function(err, symbolsMap){
        if(err) 
            return res.status(500).end();

        res.cookie('session_token', 'type_basic');
        res.json(symbolsMap);
    })
});

// /paypal/conversionRate?convertFrom=EUR&convertTo=CAD
app.get('/paypal/conversionRate', function(req, res){
    console.log("request to: "+req.url);
    curConv.getConversionRate(req.query.convertFrom, req.query.convertTo, 
        function(err, result){
            if(err) 
                return res.status(500).end();

            res.json({conversionRate: result});
        });
});

// /paypal/currencyConversion?amount=100&convertFrom=USD&convertTo=EUR
app.get('/paypal/currencyConversion', function(req, res){
    console.log("request to: "+req.url);

    curConv.convertFromAtoB(req.query.amount, req.query.convertFrom, 
        req.query.convertTo, function(err, result){
            if(err)
                return res.status(500).end();

            res.json(result);
        });   
})


app.listen(3000, function(){
	console.log("Server App listening on port 3000");
});