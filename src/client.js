import api from '@cocreate/api'

const CoCreateDomain = {
	name: 'domain',
	endPoints: {
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

api.init(CoCreateDomain);

export default CoCreateDomain;