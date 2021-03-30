import api from '@cocreate/api/src'

const CoCreateDomain = {
	id: 'domain',
	actions: [
		'cnameRecord',
		'cnameRecordDelete',
		'contactRecord',
		'contactRecordDelete',
		'customerRecord',
		'customerRecordDelete',
		'ipv4Record',
		'ipv6Record',
		'mxRecord',
		'mxRecordDelete',
		'nsRecord',
		'registerRecord',
		'txtRecord',
		'txtRecordDelete',
		'executeAction'
	],

	render_cnameRecord: function (data) {
		console.log(data);
	},
	
	render_cnameRecordDelete: function (data) {
		console.log(data);
	},
	render_contactRecordDelete: function (data) {
		console.log(data);
	},
	render_contactRecordDelete: function (data) {
		console.log(data);
	},
	render_customerRecord: function (data) {
		console.log(data);
	},
	render_customerRecordDelete: function (data) {
		console.log(data);
	},
	render_ipv4Record: function (data) {
		console.log(data);
	},
	render_ipv6Record: function (data) {
		console.log(data);
	},
	render_mxRecord: function (data) {
		console.log(data);
	},
	render_mxRecordDelete: function (data) {
		console.log(data);
	},
	render_nsRecord: function (data) {
		console.log(data);
	},
	render_registerRecord: function (data) {
		console.log(data);
	},
	render_searchRecord: function (data) {
		console.log(data);
	},
	render_txtRecord: function (data) {
		console.log(data);
	},
	render_txtRecordDelete: function (data) {
		console.log(data);
	},
	render_executeAction: function (data) {
		console.log(data)
		alert(data["id"])
		var btn = document.getElementById(data["id"]);
		//btn.dispatchEvent(new Event('click'));
		btn.click();
	},



}

api.init({
	name: CoCreateDomain.id, 
	module:	CoCreateDomain
});

export default CoCreateDomain;