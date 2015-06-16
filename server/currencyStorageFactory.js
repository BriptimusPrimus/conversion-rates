//Factory for importing the proper dependencies of currencyConversion

//must return a module that implements the interface:
	// IStorage:
	// 	function getMap()
	// 	function updateRates(updates)
function loadStorageModule(mock){
	if(mock){
		return require('./ratessources/mockStorage.js');	
	}
	else{
		return require('./ratessources/localFileStorage.js');
	}
}

//must return a module that implements the interface:
	// IPublicApiProxy:
	// 	function getMap()
function loadProxyModule(mock){
	//TODO
	if(mock){
		return require('./ratessources/mockProxy.js');
	}
	else{
		return require('./ratessources/PublicApiProxy.js');
	}
}

//Factory API
module.exports = {
	loadStorageModule: loadStorageModule,	
	loadProxyModule: loadProxyModule
};