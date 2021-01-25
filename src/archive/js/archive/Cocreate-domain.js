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
        console.log("SET RESULT")
        if(typeof(data["type"]) != 'undefined'){
            let type = data["type"];
            switch(type){
                case 'searchdomain':
                    console.log("Search Domain")
                    if(typeof(data["result"]) != 'undefined'){
                        this.drawTemplate(type,data["result"]);
                    }
                break;
            }
        }
    }//end  setResult
    
    this.customFillElementTemplate = function(type,template,element,row,attr) {
            switch(type){
                case 'searchdomain':
                    console.log("Search Domain -> customFillElementTemplate")
                    switch (attr) {
                        case 'price':
                            element.innerHTML = (row[attr]==null) ?  '0$' : row[attr]+' $'
                        break;
                        case 'status':
                            element.style.color='white';
                            let status = row[attr].toLowerCase();
                            if(status!='available')
                                element.style.backgroundColor='red';
                            else
                                element.style.backgroundColor='green';
                            element.innerHTML = (status!='available') ?  'Unavailable' : row[attr]
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