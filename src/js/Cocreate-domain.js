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
                      '.checkTransferRecordBtn',
                      '.transferRecordBtn',
                          ];
    this.data_param = 'data-domain';
    this.req_socket = 'domain';
    CocreateAPiSocket.call(this);
    
    this.setResult = function(data) {
        console.log("Set result in My Custim Class domain ",data)
        var localstorage = window.sessionStorage
        let action = '';
        if(typeof(data["type"]) != 'undefined'){
            let type = data["type"];
            switch(type){
                case 'customer':
                    action = data["action"];
                    switch (action) {
                        case 'add':
                            localstorage['id_customer'] = data['response'];
                            console.log("Action add create customer")
                                if(data['result']){
                                console.log("Create customer END ",data)
                                document.dispatchEvent(new CustomEvent('eventRegisterCustomer'));
                                }else{
                                    alert(data['response']['message'])
                                }
                            break;
                    }
                break;
                case 'contact':
                    action = data["action"];
                    switch (action) {
                        case 'add':
                            if(data['result']){
                                localstorage['id_contact'] = data['response'];
                                console.log("Create contact END",data)
                                alert("Id_customer "+localstorage['id_customer']+'id_contact'+localstorage['id_contact'])
                                document.dispatchEvent(new CustomEvent('eventregisterContact'));
                            }
                            else{
                                alert(data['response']['message'])
                            }
                        break;
                    }
                break;
                case 'searchdomain':
                    if(typeof(data["result"]) != 'undefined'){
                        /*
                        console.log("Call -> CocreateResult ",type)
                        console.log("Call -> Response ",data["response"])
                        */
                        CoCreateRender.template_id(type,data["response"]);
                        //this.drawTemplate(type,data["response"]);
                    }
                break;
                case "customer":
                    let customer_id = (data["result"]) ? data["response"] : '';
                    document.querySelector('input[name="id_customer"]').value = customer_id
                break;
                case "register":
                    //console.log("Domain ",type)
                    CoCreateRender.customFillElementTemplate(null,null,data,null,null,type);
                break;
                case 'checktransfer':
                    console.log("Response from Server CheckTransefer ",data)
                    CoCreateResponse.reponse_id(type,data["response"])
                break;
            }
        }
    }//end  setResult
    /*
    CoCreateRender.customFillElementTemplate =  function(element,row,attr_name,value,type){
        switch(type){
                case 'searchdomain':
                    switch (attr_name) {
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
    */
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