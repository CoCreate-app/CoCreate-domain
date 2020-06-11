/* global Y */
'use strict'
const confReseller = require("../../config/reseller");
let resellerclub = confReseller.resellerclub;
let url_reseller = confReseller.url_reseller;

var utils= require('../../utils/index');

module.exports=function(options) {
    let io = options.io;
    let socket = options.socket;
    
    /*Socket to management Request from ours APi to WildDuck*/
    // socket.on('dns', function(data) {
    //     let data_original = data;
    //     let type = data['type'];
    //     //delete data['type'];
    //     let url = '';
    //     let method = '';
    //     let send_response ='dns';
    //     type = type.substr(0,type.indexOf( (type.indexOf('Delete') !=-1 ) ? 'RecordDeleteBtn' : 'RecordBtn')).toLowerCase();
    //     //delete first point to class
    //     type = type.substr(1);
    //     console.log("DATA ORIGIN ",data)
    //     /*DNS in Reseller */
    //     switch (type) {
    //       case 'txt':
    //       case 'mx':
    //       case 'cname':
    //       case 'ipv4':
    //       case 'ipv6':
    //       case 'svr':
    //       case 'ns':
    //               resellerclub
    //                   	.dnsRecord({ opt : type,  options : data , extra_options: { url_api: url_reseller } })
    //                   	.then(result => {
    //                   	    result["type"] = type;
    //                     		console.log("resulto bien la peticion ",result)
    //                     		utils.send_response(socket,result,send_response)
    //                   	})
    //                   	.catch(err => {
    //                   	    let result = {'type':type,'error':err};
    //                   	    console.log("Error ",type)
    //                     	utils.send_response(socket,result,send_response)
    //                   	})
    //           break;
    //       };
    //       console.log("Final Rquest");
    // });// socket.on('dns',
    
    // socket.on('domain_customer', function(data) {
    //     // let data_original = data;
    //     let type = data['type'];
    //     //delete data['type'];
    //     let url = '';
    //     let method = '';
    //     let send_response ='domain_customer';
    //     let isDelete = (type.indexOf('Delete') != -1);
    //     let customer_id = data['id_customer'];
    //     type = type.substr(0,type.indexOf( isDelete ? 'RecordDeleteBtn' : 'RecordBtn')).toLowerCase();
    //     //delete first point to class
    //     type = type.substr(1);
    //     console.log("DATA ORIGIN ",data)
    //     delete data['type'];
    //     delete data['id_customer'];
    //     if (!isDelete) {
    //         if (customer_id != "") {
    //             resellerclub.editCustomer({customerId:customer_id, customerDetails:data, extra_options : { url_api: url_reseller }})
    //                 .then(result => {
    //               	    let res = {'type':type,'result':result};
    //                 		console.log("edit_customer ok")
    //                 		utils.send_response(socket,res,send_response)
    //               	})
    //                 .catch(err => {
    //               	    let result = {'type':type,'error':err};
    //               	    console.log("Error1 ")
    //                   	utils.send_error(socket,result,send_response)
    //               	});
            
    //         } else {
    //             resellerclub.createCustomer({ customerDetails : data, extra_options : { url_api: url_reseller } })
    //                 .then(result => {
    //                     let res = {'type':type,'result':result};
    //                 		console.log("create_customer ok")
    //                 		utils.send_response(socket,res,send_response)
    //               	})
    //                   .catch(err => {
    //               	    let result = {'type':type,'error':err};
    //               	    console.log("create_customer error ")
    //                   	utils.send_error(socket,result,send_response)
    //               	})
    //         }
    //     } else {
    //       resellerclub.deleteCustomer({customerId:customer_id, extra_options : { url_api: url_reseller } })
    //           .then(result => {
    //         	    let res = {'type':type,'result':result};
    //             		console.log("delete_customer ok")
    //             		utils.send_response(socket,res,send_response)
    //         	})
    //           .catch(err => {
    //         	    let result = {'type':type,'error':err};
    //         	    console.log("Error4 ")
    //             	utils.send_error(socket,result,send_response)
    //         	});
    //     }
    //       console.log("Final Rquest");
    // });
    
    // socket.on('domain_contact', function(data) {
    //     // let data_original = data;
    //     let type = data['type'];
    //     //delete data['type'];
    //     let url = '';
    //     let method = '';
    //     let send_response ='domain_contact';
    //     let isDelete = (type.indexOf('Delete') != -1);
    //     let contact_id = data['id_contact'];
    //     type = type.substr(0,type.indexOf( isDelete ? 'RecordDeleteBtn' : 'RecordBtn')).toLowerCase();
    //     //delete first point to class
    //     type = type.substr(1);
    //     console.log("DATA ORIGIN ",data)
    //     data['customer-id'] = data.customer_id;
    //     data['type'] = data['contact_type']
    //     delete data['contact_type'];
    //     delete data['id_contact'];
    //     delete data['customer_id'];
    //     if (!isDelete) {
    //       if (contact_id != "") {
    //         resellerclub.editContact({contactId:contact_id, contactDetails:data, extra_options : { url_api: url_reseller }})
    //             .then(result => {
    //           	    let res = {'type':type,'result':result};
    //             		console.log("edit_contact ok")
    //             		utils.send_response(socket,res,send_response)
    //           	})
    //             .catch(err => {
    //           	    let result = {'type':type,'error':err};
    //           	    console.log("Error1 ")
    //               	utils.send_error(socket,result,send_response)
    //           	});

    //       } else {
    //           resellerclub.createContact({ contactDetails : data, extra_options : { url_api: url_reseller } })
    //             .then(result => {
    //                 let res = {'type':type,'result':result};
    //             		console.log("create_contact ok")
    //             		utils.send_response(socket,res,send_response)
    //           	})
    //     	      .catch(err => {
    //           	    let result = {'type':type,'error':err};
    //           	    console.log("create_contact error ")
    //               	utils.send_error(socket,result,send_response)
    //           	})
    //       }
    //     } else {
    //       resellerclub.deleteContact({contactId:contact_id, extra_options : { url_api: url_reseller } })
    //           .then(result => {
    //         	    let res = {'type':type,'result':result};
    //             		console.log("delete_contact ok")
    //             		utils.send_response(socket,res,send_response)
    //         	})
    //           .catch(err => {
    //         	    let result = {'type':type,'error':err};
    //         	    console.log("Error4 ")
    //             	utils.send_error(socket,result,send_response)
    //         	});
    //     }
    //       console.log("Final Rquest");
    // });
    
    // socket.on('domain_search', function(data) {
    //     let type = data['type'];
    //     //delete data['type'];
    //     let url = '';
    //     let method = '';
    //     let send_response ='domain_search';
    //     let contact_id = data['id_contact'];
    //     type = 'domain_search';
    //     console.log("DATA ORIGIN ",data);
      
    //     resellerclub.searchDomain({options : data, count: data['no-of-records'], page: data['page-no'], extra_options : { url_api: url_reseller } })
    //       .then(result => {
    //     	    let res = {'type':type,'result':result};
    //       		console.log("search_domain ok")
    //       		utils.send_response(socket,res,send_response)
    //     	})
    //       .catch(err => {
    //     	    let result = {'type':type,'error':err};
    //     	    console.log("search_domain error")
    //         	utils.send_error(socket,result,send_response)
    //     	});
    //       console.log("Final Request");
    // });
    
    socket.on('domain', function(data) {
        let data_original = data;
        let type = data['type'];
        //delete data['type'];
        let url = '';
        let method = '';
        let send_response ='domain';
        let isDelete = (type.indexOf('Delete') != -1);
        // type = type.substr(0,type.indexOf( (type.indexOf('Delete') !=-1 ) ? 'RecordDeleteBtn' : 'RecordBtn')).toLowerCase();
        
        // get type for transer, search, ...
        type = type.substr(0, type.indexOf('Record')).toLowerCase();

        //delete first point to class
        type = type.substr(1);
        console.log("DATA ORIGIN ",data)

        switch (type) {
            case 'txt':
            case 'mx':
            case 'cname':
            case 'ipv4':
            case 'ipv6':
            case 'svr':
            case 'ns':
                resellerclub
                  	.dnsRecord({ opt : type,  options : data , extra_options: { url_api: url_reseller } })
                  	.then(result => {
                  	    result["type"] = type;
                    		console.log("resulto bien la peticion ",result)
                    		utils.send_response(socket,result,send_response)
                  	})
                  	.catch(err => {
                  	    let result = {'type':type,'error':err};
                  	    console.log("Error ",type)
                    	utils.send_response(socket,result,send_response)
                  	})
                break;
            case "customer":
                let customer_id = data['id_customer'];
                delete data['type'];
                delete data['id_customer'];
                if (!isDelete) {
                    if (customer_id != "") {
                        resellerclub.editCustomer({customerId:customer_id, customerDetails:data, extra_options : { url_api: url_reseller }})
                            .then(result => {
                          	    let res = {'type':type,'result':result};
                            		console.log("edit_customer ok")
                            		utils.send_response(socket,res,send_response)
                          	})
                            .catch(err => {
                          	    let result = {'type':type,'error':err};
                          	    console.log("Error1 ")
                              	utils.send_error(socket,result,send_response)
                          	});
                    } else {
                        resellerclub.createCustomer({ customerDetails : data, extra_options : { url_api: url_reseller } })
                            .then(result => {
                                let res = {'type':type,'result':result};
                            		console.log("create_customer ok")
                            		utils.send_response(socket,res,send_response)
                          	})
                    	      .catch(err => {
                          	    let result = {'type':type,'error':err};
                          	    console.log("create_customer error ")
                              	utils.send_error(socket,result,send_response)
                          	})
                    }
                } else {
                    resellerclub.deleteCustomer({customerId:customer_id, extra_options : { url_api: url_reseller } })
                        .then(result => {
                    	    let res = {'type':type,'result':result};
                        		console.log("delete_customer ok")
                        		utils.send_response(socket,res,send_response)
                    	})
                        .catch(err => {
                    	    let result = {'type':type,'error':err};
                    	    console.log("Error4 ")
                        	utils.send_error(socket,result,send_response)
                    	});
                }
                break;
            case "contact":
                let contact_id = data['id_contact'];
                data['customer-id'] = data.customer_id;
                data['type'] = data['contact_type'];
                delete data['contact_type'];
                delete data['id_contact'];
                delete data['customer_id'];
                if (!isDelete) {
                  if (contact_id != "") {
                    resellerclub.editContact({contactId:contact_id, contactDetails:data, extra_options : { url_api: url_reseller }})
                        .then(result => {
                      	    let res = {'type':type,'result':result};
                        		console.log("edit_contact ok")
                        		utils.send_response(socket,res,send_response)
                      	})
                        .catch(err => {
                      	    let result = {'type':type,'error':err};
                      	    console.log("Error1 ")
                          	utils.send_error(socket,result,send_response)
                      	});
        
                  } else {
                      resellerclub.createContact({ contactDetails : data, extra_options : { url_api: url_reseller } })
                        .then(result => {
                            let res = {'type':type,'result':result};
                        		console.log("create_contact ok")
                        		utils.send_response(socket,res,send_response)
                      	})
                	      .catch(err => {
                      	    let result = {'type':type,'error':err};
                      	    console.log("create_contact error ")
                          	utils.send_error(socket,result,send_response)
                      	})
                  }
                } else {
                  resellerclub.deleteContact({contactId:contact_id, extra_options : { url_api: url_reseller } })
                      .then(result => {
                    	    let res = {'type':type,'result':result};
                        		console.log("delete_contact ok")
                        		utils.send_response(socket,res,send_response)
                    	})
                      .catch(err => {
                    	    let result = {'type':type,'error':err};
                    	    console.log("Error4 ")
                        	utils.send_error(socket,result,send_response)
                    	});
                }
                    
                break;
            case "register":
                let domainName = data['domain-name'];
                resellerclub.register({ domainName, options:data, extra_options : { url_api: url_reseller } })
                    .then(result => {
                        let res = {'type':type,'result':result};
                        console.log("register_domain ok")
                        utils.send_response(socket,res,send_response)
                    })
                    .catch(err => {
                        let result = {'type':type,'error':err};
                        utils.send_error(socket,result,send_response)
                    });
                console.log("Final Request");
                break;
            case "search":
                resellerclub.searchDomain({options : data, count: data['no-of-records'], page: data['page-no'], extra_options : { url_api: url_reseller } })
                    .then(result => {
                        let res = {'type':type,'result':result};
                      	console.log("search_domain ok")
                      	utils.send_response(socket,res,send_response)
                    })
                    .catch(err => {
                        let result = {'type':type,'error':err};
                        console.log("search_domain error")
                    	utils.send_error(socket,result,send_response)
                    });
                console.log("Final Request");
                break;
            case "transfer":
                let domain = data['domain-name'];
                resellerclub.transfer({ domain:domain, options:data, extra_options : { url_api: url_reseller }  })
                    .then(result => {
                        let res = {'type':type,'result':result};
                      	console.log("transfer_domain ok")
                      	utils.send_response(socket,res,send_response)
                    })
                    .catch(err => {
                        let result = {'type':type,'error':err};
                        console.log("transfer_domain error")
                    	utils.send_error(socket,result,send_response)
                    });
                console.log("Final Request");
                break;
        }
    })
}
