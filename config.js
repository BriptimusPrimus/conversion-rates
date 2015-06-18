var source = "localStorage" //"localStorage"/"public"/"custom"/"default"
	mock = false,
	ratesFilePath = "./server/ratessources/rates.txt",
	publicApi = {
		host: 'openexchangerates.org',
		path: '/api/latest.json?app_id=8acbe931c9834a6d9a983165fe4b61f1'
	}

module.exports = {
	source: source,	
	mock: mock,
	ratesFilePath: ratesFilePath,
	publicApi: publicApi
};