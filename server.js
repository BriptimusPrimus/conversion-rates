//server.js

var express = require('express');
var app = express();

var curConv = require('./server/currencyConversion.js');
curConv.setConfiguration({
        source : "localStorage",
        mock: false
});

//static files location
app.use(express.static(__dirname + '/public'));

app.get('/symbols', function(req,res){
    var symbolsMap = curConv.getCurrencySymbols();
	res.json(symbolsMap);
});

app.get('/paypal/conversionRate', function(req,res){
    console.log("request to: "+req.url);
    console.log("params: convertFrom="+req.query.convertFrom+"&convertTo="+req.query.convertTo);
    var result = curConv.getConversionRate(req.query.convertFrom,req.query.convertTo);
    console.log("conversionRate:"+result);
    res.json({conversionRate: result});
});








app.listen(3000, function(){
	console.log("Server App listening on port 3000");
});