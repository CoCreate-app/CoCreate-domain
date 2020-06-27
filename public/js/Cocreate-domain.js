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
                      '.customerRecordDeleteBtn',
                      '.searchDomainRecordBtn',
                          ];
    this.data_param = 'data-domain';
    this.req_socket = 'domain';
    CocreateAPiSocket.call(this);
    
    this.setResult = function(data) {
        if(typeof(data["type"]) != 'undefined'){
            let type = data["type"];
            switch(type){
                case 'searchdomain':
                    if(typeof(data["result"]) != 'undefined'){
                        CocreateResult.drawTemplate(type,data["response"]);
                    }
                break;
                case "customer":
                    let customer_id = (data["result"]) ? data["response"] : '';
                    document.querySelector('input[name="id_customer"]').value = customer_id
                break;
            }
        }
    }//end  setResult
    
    CocreateResult.customFillElementTemplate = function(type,template,element,row,attr,value){
        switch(type){
                case 'searchdomain':
                    switch (attr) {
                        case 'price':
                            element.innerHTML = (value==null) ?  '0$' : value+' $'
                        break;
                        case 'status':
                            element.style.color='white';
                            let status = value.toLowerCase();
                            element.style.backgroundColor = (status!='available') ? 'red' : 'green';
                            element.innerHTML = (status!='available') ?  'Unavailable' : value
                        break;
                    }
                break;
            }
    }
    
    /*
    Using this function we can do it validations, return False
    */
    this.preview_validate_btn = function(btn,event){
        let selector = event.currentTarget.selector;
        switch (selector) {
            case '.searchDomainRecordBtn':
                let type = 'searchdomain';
                //delete result before send DAto to Socket
                document.querySelectorAll('.clone_'+type).forEach(e => e.parentNode.removeChild(e));
            break;
        }
        console.log("Prevent validate "+selector)
        return true;
    }

};

CocreateDomainAPi.prototype = Object.create(CocreateAPiSocket.prototype);
CocreateDomainAPi.prototype.constructor = CocreateDomainAPi;

var cocreateDomainRegisterAPi = new CocreateDomainAPi();