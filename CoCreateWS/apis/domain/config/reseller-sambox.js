const resellerclub = require("../../lib/resellerclub");

let enviroment = 'test'//'prod'

var url_reseller = 'https://httpapi.com'
var apikeys = {
			clientID: 111,
			clientSecret: "AAAAABBB"
		}

if(enviroment == 'test'){
	apikeys = {
			clientID: 222,
			clientSecret: "BBAA"
		}
    url_reseller = 'https://demo.myorderbox.com'//'https://test.httpapi.com'//AWS:52.203.210.252 186.92.175.161
}

resellerclub.connect(apikeys)
					.then(res => console.log(res))
					.catch(err => console.log(err));
					
module.exports.resellerclub = resellerclub;
module.exports.url_reseller = url_reseller;