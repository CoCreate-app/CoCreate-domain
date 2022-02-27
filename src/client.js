import api from '@cocreate/api'

const CoCreateDomain = {
	name: 'domain',
	actions: {
		activateDns: {},
		cnameRecord: {},
		cnameRecordDelete: {},
		contactRecord: {},
		contactRecordDelete: {},
		customerRecord: {},
		customerRecordDelete: {},
		ipv4Record: {},
		ipv6Record: {},
		mxRecord: {},
		mxRecordDelete: {},
		nsRecord: {},
		registerRecord: {},
		txtRecord: {},
		searchDomain: {},
		txtRecordDelete: {},
		validateTransfer: {},
		executeAction: {
			response: function (data) {
				var btn = document.getElementById(data["id"]);
				btn.click();
			}, 
		},
		checkAvailability: {}
	}
}

api.init({
	name: CoCreateDomain.name, 
	component:	CoCreateDomain
});

export default CoCreateDomain;