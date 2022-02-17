const axios = require("axios");
const Qs = require("qs");
const resellerclub = {};

// https://manage.resellerclub.com/kb/answer/764

//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


resellerclub.connect = ({ clientID, clientSecret, apiUrl }) => {
    return new Promise((resolve, reject) => {
        if (!clientID) {
            reject("`clientID` is mandatory");
        }

        if (!clientSecret) {
            reject("ClientSecret is mandatory");
        } else {
            this.clientID = clientID;
            this.clientSecret = clientSecret;
            this.ENVIRONMENT = 'development';
            this.apiUrl = apiUrl;
            resolve("RESELLER : Connection Established ["+this.clientID+"]");
        }
    });
};

this.request = ({ request, url, params, options }) => {
    
    return new Promise((resolve, reject) => {
        // Optionally the request above could also be done as
        if (!this.clientID) {
            reject("connection not establised");
        } else if (!this.clientSecret) {
            reject("connection not establised");
        } else {
            params_function = {
                "auth-userid": this.clientID,
                "api-key": this.clientSecret
            }
            if (params)
                Object.keys(params).forEach(key => params_function[key] = params[key]);
            options = typeof options !== 'undefined' ? options : false;
            ext = typeof options['ext'] !== 'undefined' ? options['ext'] : 'json';
            apiUrl = typeof options['apiUrl'] !== 'undefined' ? options['apiUrl'] : this.apiUrl;
            console.log('options', options, 'ext', ext)
            url_completa = apiUrl + '/api/' + url + '.' + ext;
            console.log(url_completa)          
            console.log(Qs.stringify(params_function, { arrayFormat: "repeat" }))

            if(request === 'get'){
                axios.get(url_completa, {
                    params: params_function,
                    paramsSerializer: function (params) {
                        return Qs.stringify(params, { arrayFormat: "repeat" });
                    }
                })
                .then(response => {
                    console.log("OK_get");
                    resolve(response.data);
                })
                .catch(error => {
                    console.log("ERROR_get")
                    reject(error.response);
                });
                
            }
                    
            else{
                axios.post(url_completa, Qs.stringify(params_function,{ arrayFormat: "repeat" }))
                    .then(response => {
                        console.log("OK_post",);
                        resolve(response.data);
                    })
                    .catch(error => {
                        console.log("ERROR_post: ", error.response.data)
                        reject(error.response.data);
                    });
            }
        }
    });
};

/**
 * Domain
 */


/**
 * Checks the availability of the specified domain name(s).
 *
 * @see http://manage.resellerclub.com/kb/answer/764
 * @param domainName mixed Domain names, without tlds - array or string.
 * @param tlds mixed TLDs, array or string.
 * @param bool suggestAlternatives TRUE if domain name suggestions is needed.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.checkAvailability = ({ params, options}) => {
    let suggestAlternatives =  params['suggest-alternative']
    params['suggest-alternative'] = typeof suggestAlternatives !== 'undefined' ? suggestAlternatives : false;
    options = {apiUrl: 'https://domaincheck.httpapi.com'}
    return this.request({ request: 'get', url: 'domains/available', params, options});
};

/**
   * Checks the availability of Internationalized Domain Name(s) (IDN).
   *
   * @see http://manage.resellerclub.com/kb/answer/1427
   * @param domainName mixed Domain name in unicode as array or string.
   * @param tld mixed TLDs as array or string.
   * @param idnLanguageCode string IDN language code.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.checkAvailabilityIdn = ({ domainName, tld, idnLanguageCode }) => {
    punyDomain = [];
    if (Array.isArray(domainName)) {
        for (key in domainName) {
            punyDomain.push(domainName[key]);
        }
    }
    else {
        punyDomain.push(domainName);
    }
    params = { 'domain-name': punyDomain, tld: tld, 'idnLanguageCode': idnLanguageCode };
    return this.request({ request: 'get', url: 'domains/idn-available',  params });
};


/**
 * Check availability of a premium domain name.
 *
 * @see http://manage.resellerclub.com/kb/answer/1948
 * @param keyWord string Keyword to search for.
 * @param tlds mixed Array or String of TLD(s).
 * @param params array See references.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.checkAvailabilityPremium = ({ keyWord, tlds, params }) => {
    params = typeof params !== 'undefined' ? params : {};
    params['key-word'] = keyWord;
    params['tlds'] = tlds;
    return this.request({ request: 'get', url: 'domains/premium/available', params });
};

/**
 * Returns domain name suggestions for a user-specified keyword.
 *
 * @see http://manage.resellerclub.com/kb/answer/1085
 * @param keyWord string Search keywords.
 * @param null tld Limit search to given TLDs.
 * @param bool exactMatch FALSE if we don't want exact match.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.domainSuggestions = ({ keyWord, tld, exactMatch, extra_params}) => {
    options = typeof  options !== 'undefined' ?  options : false;
    tld = typeof tld !== 'undefined' ? tld : null;
    exactMatch = typeof exactMatch !== 'undefined' ? exactMatch : false;
    params = {};
    params['keyword'] = keyWord;
    params['tld-only'] = tld;
    params['exact-match'] = exactMatch;
    return this.request({ request: 'get', url: 'domains/v5/suggest-names', params, options});
}


/**
 * Register a domain name.
 *
 * @see http://manage.resellerclub.com/kb/answer/752
 * @param domainName string Domain name.
 * @param params array Options, see reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.register = ({ domainName, params, options}) => {
    options = typeof  options !== 'undefined' ?  options : false;
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'domains/register', params, options});
}


/**
 * Transfer a domain name.
 *
 * @see http://manage.resellerclub.com/kb/answer/758
 * @param domain string Domain name.
 * @param params array Options, see references.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.transfer = ({ domain, params, options }) => {
    options = typeof  options !== 'undefined' ?  options : false;
    params['domain-name'] = domain;
    return this.request({ request: 'post', url: 'domains/transfer', params, options });
}


/**
 * Submit auth code for domain transfer.
 *
 * @see http://manage.resellerclub.com/kb/answer/2447
 * @param orderId integer Order Id.
 * @param authCode string Auth code from previous registrar.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.submitAuthCode = ({ orderId, authCode,  options }) => {
    options = typeof  options !== 'undefined' ?  options : false;
    params ={
        'order-id' : orderId,
        'auth-code' : authCode,
    }
    return this.request({ request: 'post', url: 'domains/submit-auth-code', params, options });
}


/**
 * Validate a transfer request.
 *
 * @see http://manage.resellerclub.com/kb/answer/1150
 * @param domain string Domain name.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */

resellerclub.validateTransfer = ({params,  options}) => {
    options = typeof  options !== 'undefined' ?  options : false;
    params = {
        'domain-name' : params['domain-name'],
    }
    return this.request({ request: 'get', url: 'domains/validate-transfer', params, options});
}

/**
 * Renew a domain.
 *
 * @see http://manage.resellerclub.com/kb/answer/746
 * @param orderid integer Order Id.
 * @param params array of params. See reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.renew = ({ params }) => {
    return this.request({ request: 'post', url: 'domains/renew',  params });
}

/**
 * Search a domain.
 *
 * @see http://manage.resellerclub.com/kb/answer/771
 * @param params array Search options. See reference.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.searchDomain = ({ params, options }) => {
    if (!params['no-of-records'])
        params['no-of-records'] = 10;
    if (!params['page-no'])
        params['page-no'] = 1;
    return this.request({ request: 'get', url: 'domains/search', params, options });
}


/**
 * Get the default nameserver for a domain.
 *
 * @see http://manage.resellerclub.com/kb/answer/788
 * @param customerId integer Customer ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getDefaultNameServer = ({ customerId }) => {
    params = {'customer-id': customerId}
    return this.request({ request: 'get', url: 'domains/customer-default-ns',  params });
}


/**
 * Get order ID from domain name.
 *
 * @see http://manage.resellerclub.com/kb/answer/763
 * @param domain string Domain name.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getOrderId = ({ params }) => {
    params = {'domain-name' : params['domain-name']}
    return this.request({ request: 'get', url: 'domains/orderid',  params });
}

/**
 * Get details of domain by order ID.
 *
 * @see http://manage.resellerclub.com/kb/answer/770
 * @param orderId integer Order ID.
 * @param params string Options. See references.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getDomainDetailsByOrderId = ({ orderId, params }) => {
    // Since a parameter name is params, we are using variable as apiOptions
    params = {'order-id': params['order-id']}
    return this.request({ request: 'get', url: 'domains/details', params });
}

/**
 * Get details of domain by domain name.
 *
 * @see http://manage.resellerclub.com/kb/answer/1755
 * @param domain string Domain name.
 * @param params string See references for possible values.
 * @return array API options.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getDomainDetailsByDomain = ({ orderId, params }) => {
    // Since a parameter name is params, we are using variable as apiOptions
    params = {'domain-name' : params['domain-name']}
    return this.request({ request: 'get', url: 'domains/details-by-name', params });
}

/**
 * Set nameserver for an order.
 *
 * @see http://manage.resellerclub.com/kb/answer/776
 * @param orderId integer Order Id.
 * @param ns array Nameservers to set.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.setNameServer = ({ params }) => {
    params = {
        'order-id': params['order-id'],
        'ns' : params['ns']
    }
    return this.request({ request: 'post', url: 'domains/modify-ns', params });
}


/**
 * Set child name server for a domain.
 *
 * @see http://manage.resellerclub.com/kb/answer/780
 * @param orderId integer Order ID.
 * @param cns string Child Nameserver.
 * @param ips array IP addresses.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.setChildNameServer = ({ params }) => {
    params = {
        'order-id': params['order-id'],
        'cns': params['cns'],
        'ip': params['ip']
    }
    return this.request({ request: 'post', url: 'domains/add-cns',  params });
}

/**
 * Modify Child nameserver host of a domain.
 *
 * @see http://manage.resellerclub.com/kb/answer/781
 * @param orderId integer Order ID.
 * @param oldCns string Old child nameserver.
 * @param newCns string New child nameserver.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.modifyChildNameServerHost = ({ params }) => {
    params = {
        'order-id': params['order-id'],
        'old-cns': params['old-cns'],
        'new-cns': params['new-cns']
    }
    return this.request({ request: 'post', url: 'domains/modify-cns-name',  params });
}

  /**
   * Modify a child name server's IP address.
   *
   * @see http://manage.resellerclub.com/kb/answer/782
   * @param orderId integer Order ID.
   * @param cns string Child name server to modify.
   * @param oldIp string Old IP address.
   * @param newIp string New IP address.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.modifyChildNameServerHost = ({ params }) => {
    params = {
        'order-id': params['order-id'],
        'cns': params['cns'],
        'old-ip': params['old-ip'],
        'new-ip': params['new-ip']
    }
    return this.request({ request: 'post', url: 'domains/modify-cns-ip',  params });
  }

  /**
   * Delete a child name server.
   *
   * @see http://manage.resellerclub.com/kb/answer/934
   * @param orderId integer Order ID.
   * @param cns string Child Nameserver.
   * @param ip string IP address.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.deleteChildNameServer = ({ orderId, cns, ip }) => {
    params = {
      'order-id' : orderId,
      'cns' : cns,
      'ip' : ip,
    }
    return this.request({ request: 'post', url: 'domains/delete-cns-ip',  params });
  }

  /**
   * Modify contacts of a domain name.
   *
   * @see http://manage.resellerclub.com/kb/answer/777
   * @param orderId int Order ID
   * @param contactIds array Contact IDs in array, all are mandatory see reference.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.modifyDomainContacts = ({ params }) => {
    return this.request({ request: 'post', url: 'domains/modify-contact',  params });
  }

  /**
   * Add privacy protection for a domain.
   *
   * @see http://manage.resellerclub.com/kb/answer/2085
   * @param orderId integer Order ID.
   * @param invoiceOption string See references for allowed options.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.addPrivacyProtection = ({ orderId, invoiceOption }) => {
    params = {
      'order-id' : orderId,
      'invoice-option' : invoiceOption,
    }
    return this.request({ request: 'post', url: 'domains/purchase-privacy',  params });
  }

  /**
   * Modify privacy protection for an order.
   *
   * @see http://manage.resellerclub.com/kb/answer/778
   * @param orderId integer Order ID.
   * @param protectPrivacy boolean TRUE to enable privacy, else FALSE.
   * @param reason string Reason for change.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
   resellerclub.modifyPrivacyProtection = ({ orderId, protectPrivacy, reason }) => {
     params = {
      'order-id' : orderId,
      'protect-privacy' : protectPrivacy,
      'reason' : reason,
    }
    return this.request({ request: 'post', url: 'domains/modify-privacy-protection',  params });
  }

  /**
   * Modify domain transfer Auth code.
   *
   * @see http://manage.resellerclub.com/kb/answer/779
   * @param orderId integer Order ID.
   * @param authCode string Auth Code for domain transfer.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
   resellerclub.modifyAuthCode = ({ orderId, authCode }) => {
    params = {
      'order-id'  : orderId,
      'auth-code'  : authCode,
    }
    return this.request({ request: 'post', url: 'domains/modify-auth-code',  params });
  }

  /**
   * Modify theft protection status.
   *
   * @see http://manage.resellerclub.com/kb/answer/902
   * @see http://manage.resellerclub.com/kb/answer/903
   * @param orderId integer Order ID.
   * @param status boolean TRUE to enable theft protection, else FALSE.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
   resellerclub.modifyTheftProtection = ({ orderId, status }) => {
    // Involves 2 API calls
    params = {
      'order-id' : orderId,
    }
    apiCall = status ? 'enable-theft-protection': 'disable-theft-protection';
    url = 'domains/'+apiCall;
    return this.request({ request: 'post', url: url,  params });
  }

  /**
   * Suspend a domain.
   *
   * @see http://manage.resellerclub.com/kb/answer/1451
   * @param orderId integer Order ID.
   * @param reason string Reason for transfer.
   * @return array API options.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.suspendDomain = ({ orderId, reason }) => {
    params = {
      'order-id' : orderId,
      'reason' : reason,
    }
    return this.request({ request: 'post', url: 'domains/suspend',  params });
  }

  /**
   * Unsuspend a domain.
   *
   * @see http://manage.resellerclub.com/kb/answer/1452
   * @param orderId integer Order ID to suspend.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.unsuspendDomain = ({ orderId }) => {
    params = {
      'order-id' :orderId,
    }
    return this.request({ request: 'post', url: 'domains/unsuspend',  params });
  }

  /**
   * Delete a domain.
   *
   * @see http://manage.resellerclub.com/kb/answer/745
   * @param orderId integer OrderID for domain to delete.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
   resellerclub.deleteDomain = ({ orderId }) => {
      params = {
          'order-id' :orderId,
        }
    return this.request({ request: 'post', url: 'domains/delete',  params });
  }

  /**
   * Restore a domain.
   *
   * @see http://manage.resellerclub.com/kb/answer/760
   * @param orderId integer Order ID.
   * @param invoiceOption string See reference for allowed options.
   * @return array API output.
   * @throws \Resellerclub\ApiConnectionException
   */
resellerclub.restoreDomain = ({ orderId, invoiceOption }) => {
    params = {
      'order-id' : orderId,
      'invoice-option' : invoiceOption
    }
    return this.request({ request: 'post', url: 'domains/restore',  params });
  }
/** Products */

/**
 * Getting the Customer Pricing.
 * 
 * @see http://manage.resellerclub.com/kb/answer/864
 * @param customerId integer Customer Id.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getPrincingCustomer = ({ customerId }) => {
     params['customer-id'] = customerId;
    return this.request({ request: 'post', url: 'products/customer-price',  params });
}

/**
 * Get ProductCategory-ProductKeys Mapping.
 * 
 * @see http://manage.resellerclub.com/kb/answer/862
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getProductsKeysMapping = () => {
    params = {};
    return this.request({ request: 'post', url: 'products/category-keys-mapping',  params });
}

/** Contacts  */


/**
 * Creates a contact with given contact details.
 *
 * @see http://manage.resellerclub.com/kb/answer/790
 * @param params array Details Contact details array as specified in API docs.
 * @return array Output of the API call.
 * @throws \Resellerclub\ApiConnectionException
 */

resellerclub.createContact = ({ params, options }) => {
    options = typeof  options !== 'undefined' ?  options : false;
    return this.request({ request: 'post', url: 'contacts/add', params, options});
}

/**
 * Deletes a contact from its ID.
 *
 * @see http://manage.resellerclub.com/kb/answer/796
 * @param contactId integer ID of contact to delete
 * @return array Output of API call
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.deleteContact = ({ params, options }) => {
    params = {'contact-id': params['contact-id']};
    return this.request({ request: 'post', url: 'contacts/delete', params, options});
}

/**
 * Modify the details of a contact
 *
 * @see http://manage.resellerclub.com/kb/answer/791
 * @param contactId array ID of contact to modify.
 * @param params array Details of contact according to API docs.
 * @return array Output of API call
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.editContact = ({ params, options }) => {
    return this.request({ request: 'post', url: 'contacts/edit', params, options});
}

/**
 * Get the contact details by ID.
 *
 * @see http://manage.resellerclub.com/kb/answer/792
 * @param contactId integer ID of contact to fetch.
 * @return array Output of API call.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getContact = ({ contactId }) => {
    params['contact-id'] = contactId;
    return this.request({ request: 'get', url: 'contacts/details', params });
}

/**
 * Search for a contact by specified customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/793
 * @param customerId integer The Customer for which you want to get the Contact Details.
 * @param params array Parameters needed to search.
 * @param int count Number of records to be shown per page.
 * @param int page Page number.
 * @return array Output of API call.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.searchContact = ({ contactId, params, count, page }) => {
    //ToDo handle page and count
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
    params['no-of-records'] = count;
    params['page-no'] = page;
    return this.request({ request: 'get', url: 'contacts/search', params });
}

/***DNS */

/*Activate dns free*/
resellerclub.activateDns = ({ params }) => {
    return this.request({ request: 'post', url: 'dns/activate', params});
}
/*Add dns record in a domain*/
resellerclub.addNsRecord = ({ domainName, options }) => {
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'dns/manage/add-ns-record',  params });
}
/* Add record A in domain */
resellerclub.addARecord = ({ domainName, options }) => {
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'dns/manage/add-ipv4-record',  params });
}
/* add or UPDATE  RECORD  DNS recerod in domain
txt -> https://manage.resellerclub.com/kb/node/1097 
mx -> https://manage.resellerclub.com/kb/node/1102 
cname -> https://manage.resellerclub.com/kb/node/1175
*/

resellerclub.dnsRecord = ({ type, params, options, isDelete }) => {
    let keys_obj = Object.keys(params);
    let url = '';
    if(isDelete)
        url = 'dns/manage/delete-'+type+'-record'
    else
        url = ( keys_obj.indexOf('current-value') != -1 && keys_obj.indexOf('new-value') != -1 ) ? 'dns/manage/update-'+type+'-record' : 'dns/manage/add-'+type+'-record';
    return this.request({ request: 'post', url, params, options});
}

/* update record txt in domain
https://manage.resellerclub.com/kb/node/1097 */
resellerclub.updateTxtRecord = ({ domainName, params, options }) => {
    options = typeof  options !== 'undefined' ?  options : false;
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'dns/manage/update-txt-record', params, options});
}

/*Add record mx in domain*/
resellerclub.addMxRecord = ({ domainName, options }) => {
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'dns/manage/add-mx-record',  params });
}
/*Add CName recrods in domain*/
resellerclub.addCnameRecord = ({ domainName, options }) => {
    params['domain-name'] = domainName;
    return this.request({ request: 'post', url: 'dns/manage/add-cname-record',  params });
}

//Add all required records for CoCreate
resellerclub.addAllRecords = ({ domain }) => {
    //Add Name Server Records
    if ('development' === this.ENVIRONMENT) {
        nsRecords = ['ns1.onlyfordemo.net', 'ns2.onlyfordemo.net'];
    } else {
        nsRecords = ['hand676937.mars.orderbox-dns.com', 'hand676937.earth.orderbox-dns.com', 'hand676937.venus.orderbox-dns.com', 'hand676937.mercury.orderbox-dns.com'];
    }
    for (key in nsRecords) {
        record = nsRecords[key];
        details = {
            "domain-name" : domain,
            "value" : record,
            "host" : domain,
        }
        nsRecord[record] = this.addNsRecord(domain, details);
    }

    //Add txt record
    details = {
        'value' : 'v=spf1 a mx ptr ip4:208.109.80.0/24 include:_spf.google.com -all',
        'host' : '@'
    }
    resultSpf = this.addTxtRecord(domain, details);

    //Creates DKIM 1
    details = {
        'value' : 'o=~; r=noreply@'+domain,
        'host' : '_domainKey'
    }
    resultDKIM1 = this.addTxtRecord(domain, details);

    //creates DKIM 2
    /*
    details = array(
      'value' => 'k=rsa; p='.,
      'host' => 'mainkey._domainkey'
    );
    resultDKIM2 = dns->addTxtRecord(domain, details);
    */

    /*Add A Records*/
    records_a = ['@', '*', 'mail'];
    for (key in records_a) {
        record = records_a[key];
        details = {
            'value' : '132.148.1.250',
            'host' : record
        }
        result = this.addARecord(domain, details);
        resultA[record] = result;
    }

    //Add mx records
    records_mx = ['mail.'+domain+'.com', 'imap.'+domain+'.com', 'aspmx.l.google.com', 'alt1.aspmx.l.google.com', 'alt2.aspmx.l.google.com', 'alt3.aspmx.l.google.com', 'alt4.aspmx.l.google.com'];
    for (key in records_mx) {
        record = records_mx[key];
        details = {
            'value' : record,
            'host' : domain
        }
        resultMx = this.addMxRecord(domain, details);
        resultsMx[record] = resultMx;
    }

    //Add cname
    details = {
        'value' : 'mailgun.org',
        'host' : 'email.'+domain
    }
    resultCname = this.addCnameRecord(domain, details);
    return {"nsRecord": nsRecord, "resultSpf": resultSpf, "resultDKIM1": resultDKIM1, "resultA": resultA, "resultsMx": resultsMx, "resultCname": resultCname};
}

/** Customer */


/**
 * Creates a Customer Account using the details provided.
 *
 * @see http://manage.resellerclub.com/kb/answer/804
 * @param  params array See reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.createCustomer = ({ params, options }) => {
    options = typeof  options !== 'undefined' ?  options : false;
    return this.request({ request: 'post', url: 'customers/signup', params, options });
}


/**
 * Modifies the Account details of the specified Customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/805
 * @param customerId integer Customer Id.
 * @param  params array See reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.editCustomer = ({params,  options }) => {
    return this.request({ request: 'post', url: 'customers/modify', params, options });
}

/**
 * Gets the Customer details for the specified Customer Username.
 *
 * @see http://manage.resellerclub.com/kb/answer/874
 * @param userName string User name (email).
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCustomerByUserName = ({ userName }) => {
     params['username'] = userName;
    return this.request({ request: 'get', url: 'customers/details',  params });
}

/**
 * Gets the Customer details for the specified Customer Id.
 *
 * @param customerId integer Customer Id.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCustomerByCustomerId = ({ customerId,  options }) => {
    let  params = [];
     params['customer-id'] = customerId;
    return this.request({ request: 'get', url: 'customers/details-by-id', params, options });
}

/**
 * Authenticates a Customer by returning an authentication token.
 *
 * @see http://manage.resellerclub.com/kb/answer/818
 * @param userName string User Name.
 * @param password string Password.
 * @param ip string IP address.
 * @return array API output. Token if successfully authenticated.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.generateToken = ({ userName, password, ip }) => {
     params['username'] = userName;
     params['passwd'] = password;
     params['ip'] = ip;
    return this.request({ request: 'get', url: 'customers/generate-token',  params });
}

/**
 * Authenticates the token generated by the Generate Token method.
 * @param token string Authentication token.
 * @return array API output. Customer details if authenticated.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.authenticateToken = ({ token }) => {
     params['token'] = token;
    return this.request({ request: 'post', url: 'customers/authenticate-token',  params });
}

/**
 * Changes the password for the specified Customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/806
 * @param customerId integer Customer ID.
 * @param newPassword string New password.
 * @return array API output. TRUE is password change is successful.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.changePassword = ({ customerId, newPassword }) => {
     params['customer-id'] = customerId;
     params['new-passwd'] = newPassword;
    return this.request({ request: 'post', url: 'customers/change-password',  params });
}

/**
 * Generates a temporary password for the specified Customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/1648
 * @param customerId integer Customer ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.generateTemporaryPassword = ({ customerId }) => {
     params['customer-id'] = customerId;
    return this.request({ request: 'post', url: 'customers/temp-password', params });
}

/**
 * Gets details of the Customers that match the Search criteria.
 *
 * @see http://manage.resellerclub.com/kb/answer/1270
 * @param  params array Details of customer. See reference.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.searchCustomer = ({  params, count , page  }) => {
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
     params['no-of-records'] = count;
     params['page-no'] = page;
    return this.request({ request: 'get', url: 'customers/search',  params });
}

/**
 * Generates a forgot password email and sends it to the customer's email address.
 *
 * @see http://manage.resellerclub.com/kb/answer/2410
 * @param userName string Username.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.forgotPassword = ({ userName }) => {
     params['forgot-password'] = userName;
    return this.request({ request: 'post', url: 'customers/forgot-password',  params });
}

/**
 * Deletes the specified Customer, if the Customer does not have any Active Order(s).
 * 
 * @see http://manage.resellerclub.com/kb/answer/886
 * @param customerId integer Customer Id.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.deleteCustomer = ({ customerId ,  options}) => {
    let  params = [];
    params['customer-id'] = customerId;
    return this.request({ request: 'post', url: 'customers/delete', params, options });
}

/** Billing  */
/**
 * Get the pricing of customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/864
 * @param customerId integer Customer ID
 * @return array API call output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCustomerPricing = ({ customerId }) => {
    params = {
        'customer-id' : customerId,
    }
    return this.request({ request: 'get', url: 'products/customer-price',  params });
}

/**
 * Get pricing for reseller.
 *
 * @see http://manage.resellerclub.com/kb/answer/865
 * @param resellerId integer Reseller ID.
 * @return array API call output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getResellerPricing = ({ resellerId }) => {
    params = {
        'reseller-id' : resellerId,
    }
    return this.request({ request: 'get', url: 'products/reseller-price',  params });
}

/**
 * Get the cost pricing of reseller.
 *
 * @see http://manage.resellerclub.com/kb/answer/1029
 * @param resellerId integer Reseller ID
 * @return array API call output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getResellerCostPricing = ({params, options}) => {
    // options = typeof  options !== 'undefined' ?  options : false;
    params = {'reseller-id': params['reseller-id']}
    return this.request({ request: 'get', url: 'products/reseller-cost-price', params, options});
}

/**
 * Gets a Customer's Transactions along with their details.
 *
 * @see http://manage.resellerclub.com/kb/answer/868
 * @param transactionIds mixed Array or a single Transaction ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCustomerTransactionDetails = ({ transactionIds }) => {
    params = {
        'transaction-ids' : transactionIds,
    }
    return this.request({ request: 'get', url: 'products/customer-transactions',  params });
}

/**
 * Gets a Reseller's Transactions along with their details.
 *
 * @see http://manage.resellerclub.com/kb/answer/1155
 * @param transactionIds mixed Array or a single Transaction ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getResellerTransactionDetails = ({ transactionIds }) => {
    params =  {
        'transaction-ids' : transactionIds,
    }
    return this.request({ request: 'get', url: 'products/reseller-transactions',  params });
}

/**
 * Pay the transactions using the account balance.
 *
 * @see http://manage.resellerclub.com/kb/answer/871
 * @param invoiceIds array IDs of invoices.
 * @param debitIds array Ids of debit Ids
 * @return array API call output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.payTransactions = ({ invoiceIds, debitIds }) => {
    invoiceIds = typeof invoiceIds !== 'undefined' ? invoiceIds : [];
    debitIds = typeof debitIds !== 'undefined' ? debitIds : [];
    params = {
        'invoice-ids' : invoiceIds,
        'debit-ids' : debitIds,
    }
    return this.request({ request: 'post', url: 'billing/customer-pay',  params });
}

/**
 * Cancel invoice(s) or/and debit note(s).
 *
 * @see http://manage.resellerclub.com/kb/answer/2415
 * @param invoiceIds array Invoice ids.
 * @param debitIds array Debit note ids.
 * @return array API Output.
 * @throws \Resellerclub\ApiConnectionException
 */
/** ojo */
resellerclub.cancelInvoiceDebitNote = ({ invoiceIds, debitIds }) => {
    invoiceIds = typeof invoiceIds !== 'undefined' ? invoiceIds : [];
    debitIds = typeof debitIds !== 'undefined' ? debitIds : [];
    params = {
        'invoice-ids' : invoiceIds,
        'debit-ids' : debitIds,
    }
    return this.request({ request: 'post', url: 'billing/cancel/customer-transactions',  params });
}

/**
 * Get account balance of a customer.
 *
 * @see http://manage.resellerclub.com/kb/answer/872
 * @param customerId int Customer ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCustomerBalance = ({ customerId }) => {
    params = {
        'customer-id' :customerId,
    }
    return this.request({ request: 'get', url: 'billing/customer-balance',  params });
}

/**
 * Execute an order without payment from customer side.
 *
 * @see http://manage.resellerclub.com/kb/answer/873
 * @param invoiceIds array Invoice ID(s).
 * @param bool cancelInvoice TRUE if invoice needs to be cancelled, else FALSE.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.executeOrderWithoutPayment = ({ invoiceIds, cancelInvoice }) => {
    cancelInvoice = typeof cancelInvoice !== 'undefined' ? cancelInvoice : false;
    params = {
        'invoice-ids' : invoiceIds,
        'cancel-invoice' : cancelInvoice,
    }
    return this.request({ request: 'post', url: 'billing/execute-order-without-payment',  params });
}

/**
 * Gets a detailed list of Customer's Transactions, matching the search criteria.
 *
 * @see http://manage.resellerclub.com/kb/answer/964
 * @param params array Search criteria. See reference for options.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
/** ojo */
resellerclub.searchCustomerTransaction = ({ params, page, count  }) => {
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
    params['no-of-records'] = count;
    params['page-no'] = page;
    //TODO: Check
    return this.request({ request: 'get', url: 'billing/search/customer-transactions',  params });
}

/**
 * Gets a detailed list of Reseller's Transactions, matching the search criteria.
 *
 * @see http://manage.resellerclub.com/kb/answer/1153
 * @param params array Search criteria. See reference for options.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
/** ojo */
resellerclub.searchResellerTransaction = ({ params, page, count }) => {
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
    params['no-of-records'] = count;
    params['page-no'] = page;
    return this.request({ request: 'get', url: 'billing/search/reseller-transactions',  params });
}

/**
 * Get available account balance of a reseller.
 *
 * @see http://manage.resellerclub.com/kb/answer/1110
 * @param resellerId int Reseller ID.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getResellerBalance = ({ resellerId }) => {
    params = {
        'reseller-id' : resellerId,
    }
    return this.request({ request: 'get', url: 'billing/reseller-balance',  params });
}

/**
 * Adds a discount for a given invoice.
 *
 * @see http://manage.resellerclub.com/kb/answer/2414
 * @param invoiceId int Invoice ID to be discounted.
 * @param discount float Discount amount without tax.
 * @param transactionKey string A unique transaction key.
 * @param role string "reseller"/"customer"
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.discountInvoice = ({ invoiceId, discount, transactionKey, role }) => {
    params = {
        'invoice-id' : invoiceId,
        'discount-without-tax': discount,
        'transaction-key' : transactionKey,
        'role' : role,
    }
    return this.request({ request: 'post', url: 'billing/customer-processdiscount',  params });
}

/**
 * Adds funds in a Customer's Account.
 *
 * @see http://manage.resellerclub.com/kb/answer/1152
 * @param customerId integer Customer id.
 * @param params array Details like amount, see reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.addFundsCustomer = ({ customerId, options }) => {
    params['customer-id'] = customerId;
    return this.request({ request: 'post', url: 'billing/add-customer-fund',  params });
}

/**
 * Adds funds in a Reseller's Account.
 *
 * @see http://manage.resellerclub.com/kb/answer/1151
 * @param resellerId integer Reseller id.
 * @param params array Details like amount, see reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.addFundsReseller = ({ resellerId, options }) => {
    params['reseller-id'] = resellerId;
    return this.request({ request: 'post', url: 'billing/add-reseller-fund',  params });
}

/**
 * Add debit note in a Customer's Account.
 *
 * @see http://manage.resellerclub.com/kb/answer/1166
 * @param customerId integer Customer id.
 * @param params array Details like amount, see reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.addDebitNoteCustomer = ({ customerId, options }) => {
    params['customer-id'] = customerId;
    return this.request({ request: 'post', url: 'billing/add-customer-debit-note',  params });
}

/**
 * Add debit note in a Reseller's Account.
 *
 * @see http://manage.resellerclub.com/kb/answer/1167
 * @param resellerId integer Reseller id.
 * @param params array Details like amount, see reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.addDebitNoteReseller = ({ resellerId, options }) => {
    params['reseller-id'] = resellerId;
    return this.request({ request: 'post', url: 'billing/add-reseller-debit-note',  params });
}

/**
 * Suspend an order, in case the client screws up.
 *
 * @see http://manage.resellerclub.com/kb/answer/1077
 * @param orderId integer Order Id to suspend.
 * @param reason string Reason to state for suspension.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.suspendOrder = ({ orderId, reason }) => {
    params = {
        'order-id' : orderId,
        'reason' :  reason,
    }
    return this.request({ request: 'post', url: 'orders/suspend',  params });
}

/**
 * Unsuspend an order.
 *
 * @see http://manage.resellerclub.com/kb/answer/1078
 * @param orderId integer Order ID to unsuspend.
 * @return array API Output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.unsuspendOrder = ({ orderId }) => {
    params = {
        'order-id' : orderId,
    }
    return this.request({ request: 'post', url: 'orders/unsuspend',  params });
}

/**
 * Gets the Current Actions based on the criteria specified.
 *
 * @see http://manage.resellerclub.com/kb/answer/908
 * @param params array Search parameters. See reference.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCurrentActions = ({ params, page ,count }) => {
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
    params['no-of-records'] = count;
    params['page-no'] = page;
    return this.request({ request: 'get', url: 'actions/search-current',  params });
}

/**
 * Searches the Archived Actions based on the criteria specified.
 *
 * @see http://manage.resellerclub.com/kb/answer/909
 * @param params array Search parameters. See reference.
 * @param int page Page number.
 * @param int count Number of records to fetch.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getArchiveActions = ({ params, page, count }) => {
    page = typeof page !== 'undefined' ? page : 1;
    count = typeof count !== 'undefined' ? count : 10;
    params['no-of-records'] = count;
    params['page-no'] = page;
    return this.request({ request: 'get', url: 'actions/search-archived',  params });
}

/**
 * Gets the default and customized Legal Agreements.
 *
 * @see http://manage.resellerclub.com/kb/answer/835
 * @param type string type of legal aggrement. See reference.
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getLegalAggrement = ({ type }) => {
    params = {
        'type' : type
    }
    return this.request({ request: 'get', url: 'commons/legal-agreements',  params });
}

/**
 * Get allowed payment gateway for a customer
 *
 * @param int customerId Customer ID
 * @param string paymentType Values can be AddFund or Payment.
 * @return array Parsed output of API call
 */
resellerclub.getAllowedPaymentGatewayCustomer = ({ customerId, paymentType }) => {
    paymentType = typeof paymentType !== 'undefined' ? paymentType : null;
    params['customer-id'] = customerId;
    if (paymentType != null) {
        params['payment-type'] = paymentType;
    }
    return this.request({ request: 'get', url: 'pg/allowedlist-for-customer',  params });
}

/**
 * Get allowed Payment Gateways
 * @return array Parsed output of API call
 */
resellerclub.getAllowedPaymentGatewayReseller = () => {
    params = {}
    return this.request({ request: 'get', url: 'pg/list-for-reseller',  params });
}

/**
 * Get a list of approved currencies.
 *
 * @see http://manage.resellerclub.com/kb/answer/1745
 * @return array API output.
 * @throws \Resellerclub\ApiConnectionException
 */
resellerclub.getCurrencyDetails = () => {
    params = {}
    return this.request({ request: 'get', url: 'currency/details',  params });
}

/**
 * Get list of country
 *
 * @see http://manage.resellerclub.com/kb/answer/1746
 * @return array Parsed output of API call
 */
resellerclub.getCountryList = () => {
    params = {}
    return this.request({ request: 'get', url: 'currency/list',  params });
}

/**
 * Get list of states of a given country
 *
 * @see http://manage.resellerclub.com/kb/answer/1747
 * @param string countryCode 2 letter country code
 * @return array Parsed output of API call
 */
resellerclub.getStateList = ({ countryCode }) => {
    params = {
        'country-code': countryCode,
    }
    return this.request({ request: 'post', url: 'country/state-list',  params });
}


module.exports = resellerclub;