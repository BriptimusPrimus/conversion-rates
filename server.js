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
  console.log('Hi Cross Domain', req.headers);
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://localhost.paypal.com:3000");
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header("Access-Control-Allow-Credentials: true");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// /start hackathon mock endpoint
app.get('/start', function(req, res) {
  console.log('');console.log('');
  console.log('*******************************');console.log('*******************************');
  console.log('This is U2F client start endpoint (simulated)');
  console.log('sec_context:', req.cookies['x-factor']);
  console.log('*******************************');console.log('*******************************');
  console.log('');console.log('');
  res.send('<html><body><p>This is U2F client app</p><p>' +
    'sec_context:' + JSON.stringify(req.cookies['x-factor']) +
    '</p></body></html>');
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


var port = process.env.PORT || 8443;
app.listen(port, function(){
	console.log("Server App listening on port ", port);
});
