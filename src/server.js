'use strict'
const resellerclub = require("./lib");
const  api = require("@cocreate/api");

class CoCreateDomain {
	constructor(wsManager) {
		this.moduleName = 'domain';
		this.wsManager = wsManager;
		this.init();		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on('domain',	(socket, data) => this.sendDomain(socket, data));
		}
	}

	async sendDomain(socket, data) {
		let params = data['data'];
        let action = data['action'];
		let environment;

    	 // connect domain reseller api
    	 try{
			let org = await api.getOrg(data, this.moduleName);
			if (params.environment){
			  environment = params['environment'];
			  delete params['environment'];  
			} else {
			  environment = org.apis[this.moduleName].environment;
			}

			var apiUrl = org.apis[this.moduleName][environment].apiUrl;//'https://httpapi.com'
            let apiKeys = {
				'clientID': org.apis[this.moduleName][environment].clientID,
				'clientSecret': org.apis[this.moduleName][environment].clientSecret,
				apiUrl
			}

			resellerclub.connect(apiKeys)
				.then(res => console.log(res))
				.catch(err => console.log(err));
            					
    	 }catch(e){
    	   	console.log(this.moduleName+" : Error Connecting to api Reseller", e)
    	   	return false;
    	 }
	 
        let isDelete = (action.indexOf('Delete') != -1);
        if (action.indexOf('Record') !== -1)
        	action = action.substr(0, action.indexOf('Record')).toLowerCase();

		let response;
		try {
			switch (action) {
				case 'executeAction':
					console.log("params ", params)
				break;
				case 'activateDns':
					response = await resellerclub.activateDns({ params, options: { apiUrl } });
					break;
				case 'txt':
				case 'mx':
				case 'cname':
				case 'ipv4':
				case 'ipv6':
				case 'svr':
				case 'ns':
					response = await resellerclub.dnsRecord({ action, params, options: { apiUrl }, isDelete });
					break;
				case "customer":
					if (!isDelete) {
						if (params['customer-id'])
							response = await resellerclub.editCustomer({params, options: { apiUrl } })
						else
							response = await resellerclub.createCustomer({ params, options: { apiUrl } })
					} else {
						response = await resellerclub.deleteCustomer({params, options: { apiUrl } })
					}
					break;
				case "contact":
					if (!isDelete) {
						if (params['contact-id'])
							response = await resellerclub.editContact({params, options: { apiUrl }})
						else
							response = await resellerclub.createContact({ params, options: { apiUrl } })
					} else {
						response = await resellerclub.deleteContact({params, options: { apiUrl } })	
					}
					break;
				case "register":
					response = await resellerclub.register({ params, options: { apiUrl } })
					break;
				case "searchDomain":
					response = await resellerclub.searchDomain({params, options: { apiUrl } })
					break;
				case "validateTransfer":
					response = await resellerclub.validateTransfer({params, options: { apiUrl }})
					break;
				case "transfer":
					response = await resellerclub.transfer({ params, options: { apiUrl } })
					break;
				case 'checkAvailability':
					let tlds_list = ["company","business","com", "net", "biz", "tk","org","club","site","info","online","xyz"];
					let domainName = params['domain-name']
					let tlds = params['tlds']
					params['tlds'] = validationForm( (typeof tlds != 'undefined' && tlds.length > 0) ? tlds : tlds_list, domainName);
					var allPricing = await resellerclub.getResellerCostPricing({params, options: { apiUrl }});
					let res = await resellerclub.checkAvailability({ params })
					response = await mergeDomains(allPricing, res, params['tlds'], domainName)
					break;
			}
			this.wsManager.send(socket, this.moduleName, { action, response })
		
		} catch (error) {
			this.handleError(socket, action, error)
		}
	}

	handleError(socket, action, error) {
		const response = {
		  'object': 'error',
		  'data': error || error.response || error.response.data || error.response.body || error.message || error,
		};
		this.wsManager.send(socket, this.moduleName, { action, response })
	}	
}

module.exports = CoCreateDomain;

async function getElementFromArray($array, keyFind){
	for(var key in $array){
		for(var j in $array[key]){
			if(keyFind == j)
				return $array[key];
		}
	}
	return [];
}

async function getDomainsPrice($allPricing, $domains){
	let $domainsWithPrice = [];
	let $classKey = '';
	let num_domains = Object.keys($domains).length;
	if(num_domains  > 0) {
		for(var key in $domains){
			let domain = key;
			var row = {};
			row[domain] = {};
			row[domain]['status'] = ( $domains[domain].hasOwnProperty('status') && typeof $domains[domain]['status'] != 'undefined' ) ? $domains[domain]['status'] : '';
			if(row[domain]['status'] == 'available' ) {
				$classKey = $domains[domain]['classkey'];
				row[domain]['classKey'] = $classKey;
				let $prices = $allPricing[$classKey]['addnewdomain'];
				let $price = 0;
				for(var key_p in $prices){
					$price = $prices[key_p];
				}
				row[domain]['price'] = $price;
			}

			$domainsWithPrice.push(row);
		}
	}
	return $domainsWithPrice;
}

async function mergeDomains(allPricing, res_reseller, tlds, domainName){
	let $data = await getDomainsPrice(allPricing, res_reseller)
	let $domains = []
	for(var tld in tlds){
		let $domain = {};
		let $fulldomainname = domainName + "." + tlds[tld];
		let row = await getElementFromArray($data, $fulldomainname);
		$domain['name'] = $fulldomainname;
		$domain['status'] = row[$fulldomainname]['status'];
		$domain['price'] = typeof row[$fulldomainname]['price'] != 'undefined' ? row[$fulldomainname]['price'] : null;
		$domain['test'] = {'hey': {'name': 'test with frankie pagan'}}
		$domains.push($domain);
	}
	let response = {result: true, data: $domains};
	return response;
}

function validationForm(tlds, domainName){
    let tlds_list = [];
	if(typeof tlds != 'undefined' && tlds.length > 0)
		tlds_list = tlds

	if (domainName != ""){
		let $arr = domainName.split('.');
		let $checkStr = $arr[0];
		let $extension = 0;
		let $pos = 0;
		if ($checkStr == "www")
			domainName = $arr[1];
		if ($arr[0] != "www" && $arr.hasOwnProperty(1)){
			domainName = $arr[0];
			$extension = $arr[1];
			$pos = tlds_list.indexOf($extension);
			if ($pos !== -1){
				tlds_list.splice($pos,1);
			}
			tlds_list.unshift($extension);
		}
		if ($arr[0] == "www" && $arr.hasOwnProperty(2)){
			domainName = $arr[1];
			$extension = $arr[2];
			$pos = tlds_list.indexOf($extension);
			if ($pos !== -1){
				tlds_list.splice($pos,1);
			}
			tlds_list.unshift($extension);
		}
	}
	return tlds_list;
}//end validationForm
