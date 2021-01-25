success: function(res){
                var rows_domains = [];
                var domain = res.domains;
                var html = '';
                var borderClass = '';
                var status = '';
                var statusClass  = '';
                var textStatusClass = '';
                var count = 0;
                var availableCount = 0;
                var isMatch = false;
                var isExecute = false;
                domain.forEach(function(domain){
                    if(domain['name'] != domain_search && domain['status'] == 'available' && !isExecute) {
                        isExecute = true;
                        if(isMatch) {
                            html+='<h3 style="margin-top: 20px;">Other matching domains that are available</h3>';   
                        }else {
                            html+='<h3 style="margin-top: 20px;">Search results for "'+domain_search+'"</h3>';  
                        }
                    }
                    borderClass = '';
                    status = '';
                    textStatusClass = '';
                    if(domain_array.indexOf(domain['name']) != -1) { //if(domain['name'] == domain_search) {
                        isMatch = true;
                        status = (domain['status'] == 'available') ? 'available' : 'unavailable';
                        borderClass =  (status == 'available') ? 'greenBorder' : 'redBorder';
                        textStatusClass = (status == 'available') ? 'greenText' : 'redText';
                    }
                    if(status != '' || (count >= 0 && domain['status'] == 'available')) {
                        html+='<div class="col-sm-12 domainListBox '+borderClass+'">';
                        html+='<div class="row">';
                        html+='<div class="col-sm-8">';
                        html+='<h3 class="domainNameWrap '+status+'"><span class="domainName">'+domain['name']+'</span>';
                        html+= (status != '') ? '<br> is <span class="'+textStatusClass+'">'+status+'</span></h3>' : '';
                        html+='</div>';
                        html+='<div class="col-sm-4 text-center">';
                        html+= (domain['status'] == 'available') ? '<h3 class="domainPrice">$ '+domain['price']+'</h3>' : '';
                        html+='</div>';
                        html+='</div>';
                        html+='<div class="row">';
                        html+='<div class="col-sm-8">';
                        html+='<div class="custom-select" style="width:100px;">';
                        if(domain['status'] == 'available') {
                            html+='<select id="domain_year_'+count+'" class="selectYear">';
                            var i = 1;
                            while(i<=10){
                                html += (i==1 ? '<option value="'+i+'">'+i+' Year</option>' : '<option value="'+i+'">'+i+' Years</option>');
                                i++;
                            }
                            html+='</select>';  
                        }
                        html+=(domain['status'] == 'available' && domain['price'] != null) ?  'privacy <input type="checkbox" name="purchase-privacy">' : '';
                        html+='</div>';
                        html+='</div>';
                        html+='<div class="col-sm-4 text-center">';
                        html+=(domain['status'] == 'available' && domain['price'] != null) ? '<button data-type="regist_domain" data-domain="'+domain['name']+'" data-price="'+domain['price']+'" data-selectid="domain_year_'+count+'" class="register_domainBtn btnSelectDomain  checkout_product" data-datatable_width="320">Select</button>' : '';
                        html+='</div>';
                        html+='</div>';
                        html+='</div>';   
                        availableCount++;
                    } 
                    count++;
                },rows_domains);
                if(availableCount == 0) {
                    html+='<h3 style="margin-top: 20px;">No domain available for "'+domain_search+'</h3>';
                }
                $("#result_domain").html(html)
        }