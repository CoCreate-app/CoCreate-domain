var CocreateDomainAPi = function() {
    this.classBtns = ['.txtRecordBtn',
                      '.mxRecordBtn', 
                      '.cnameRecordBtn', 
                      '.ipv4RecordBtn', 
                      '.ipv6RecordBtn', 
                      '.svrRecordBtn', 
                      '.nsRecordBtn',
                      '.registerRecordBtn',
                      '.searchRecordBtn',
                      '.transferRecordBtn',
                      '.contactRecordBtn',
                      '.customerRecordBtn',
                      '.txtRecordDeleteBtn',
                      '.mxRecordDeleteBtn',
                      '.cnameRecordDeleteBtn',
                      '.ipv4RecordDeleteBtn',
                      '.ipv6RecordDeleteBtn',
                      '.srvRecordDeleteBtn',
                      '.nsRecordDeleteBtn',
                      '.contactRecordDeleteBtn',
                      '.customerRecordDeleteBtn'
                          ];
    this.data_param = 'data-domain';
    this.req_socket = 'domain';
    CocreateAPiSocket.call(this);
    this.setResult = function(data) {
        console.log(data);
    }
};

CocreateDomainAPi.prototype = Object.create(CocreateAPiSocket.prototype);
CocreateDomainAPi.prototype.constructor = CocreateDomainAPi;

var cocreateDomainRegisterAPi = new CocreateDomainAPi();