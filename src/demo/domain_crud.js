var callback_result_domain=function(data){};
var SERVER = 'http://localhost:3000';
var SERVER = 'http://52.203.210.252:8080';
    
$(document).ready(function(){
    var tlds = [{name: 'com', type: 'popular'},{name: 'net', type: 'popular'},{name: 'biz', type: 'popular'},{name: 'managment', type: 'popular'},{name: 'online', type: 'popular'},{name: 'org', type: 'popular'},{name: 'club', type: 'popular'},{name: 'xyz', type: 'popular'},{name: 'info', type: 'popular'},{name: 'site', type: 'popular'},{name: 'us', type: 'other'},{name: 'name', type: 'other'},{name: 'house', type: 'other'},{name: 'in', type: 'other'},{name: 'eu', type: 'other'},{name: 'bz', type: 'other'},{name: 'cc', type: 'other'},{name: 'tv', type: 'other'},{name: 'cn', type: 'other'},{name: 'mobi', type: 'other'},{name: 'mn', type: 'other'},{name: 'uk', type: 'other'},{name: 'ws', type: 'other'},{name: 'travel', type: 'other'},{name: 'asia', type: 'other'}];
    $.each(tlds,function(i,tld){
        if(tld.type == 'popular'){
            input_tld = '<label><input type="checkbox" name="tlds" value="'+tld.name+'"/>' +tld.name +'</label>';
            $("#tlds").append(input_tld)
        }
    });
    $(".search_domainBtn").on("click",function(e){
        e.preventDefault();
        $('#result_domain').html('<div align="center"><img src="'+SERVER+'/imgs/ajax-loader.gif" height="50px"></div>');
        var btn = $(this)
        var domain_search = $(btn).parents('form').find('input[name="domain_name"]').val()
        var domain_array =[]
        var ext = [];
        var domain_search_array = domain_search.split(".");
        var domain = domain_search_array[0];
        domain_array.push(domain_search)
        if(domain_search_array.length > 1){
            if (domain_search_array.length == 3)
                domain = domain_search_array[1];
        }
        $("input[name='tlds']:checked").each(function(i,v){
            domain_ext = $(v).val()
            ext.push(domain_ext)
            domain_array.push(domain+"."+domain_ext)
        });
        if (domain_search == ''){
            alert("Escriba un nombre de dominio");
            return false
        }
        $.ajax({
            url: SERVER+'/api/reseller/searchDomain',
            type: 'GET',
            dataType: 'JSON',
            data: {'ext': ext, 'domain': domain_search}, 
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
        })//end ajax
    });//end click btn_search

    /*Transfer*/
    //actions TABS
    $.each(tlds,function(i,tld){
        $("select[name='transfer_domain_ext']").append('<option value="'+tld.name+'">'+tld.name+'</option>');
    });

    $('ul.domainTab li a').on('click',function(e){
        href = $(this).attr('href');
        $('ul.domainTab li a').each(function(i,a){
            a_href = $(a).attr('href');
            $(a).parents('li').removeClass('active');
            $(a_href).hide();
        });
        $(this).parents('li').addClass('active');
        $(href).show()
    });

    $(document).on('click touchstart','.check_transfer_domain',function(){
        let $button = $(this);
        domain_name = $button.parents('form').find('input[name="transfer_domain_name"]').val()
        domain_ext = $button.parents('form').find('select[name="transfer_domain_ext"]').val()
        alert(domain_name+' '+domain_ext)
        $.ajax({
            beforeSend: function(){
                $button.attr('disabled','disabled');
                $button.addClass('disabled');
                $button.html( 'Checking... <i class="fa fa-spinner fa-spin" aria-hidden="true" ></i>' );
            },
            url: SERVER+'/api/reseller/checkTransferDomain',
            type: 'POST',
            dataType: 'JSON',
            data: {domain_name: domain_name, domain_ext: domain_ext},
            success: function(res){
                console.log(res)
                if(res.result == true){
                    alert('Proceed Checkout')
                    $button.hide()
                    $("#transfer_domain").show()
                    
                }else{
                    $button.removeAttr('disabled');
                    $button.removeClass('disabled');
                    $button.html("Check Transfer");
                    alert("No esta disponible")
                }
            },//end success
        });
    });//end click check_transfer_domain
    
    $(document).on('click touchstart','#transfer_domain',function(){
        let $button = $(this);
        var domain_name = 'cocreatejs.info';
        var codeTransfer = 'HY3EY1CD4F294CB6';
        /*
        var customerId = '20436462';
        var contactId = '84311842';
        */
        var contactId = $('#contact-id').val();
        var customerId = $('#customer-id').val();
        alert(" customer = "+customerId+ " contact = "+contactId)
        $.ajax({
            beforeSend: function(){
                $button.attr('disabled','disabled');
                $button.addClass('disabled');
                $button.html( 'Transferring... <i class="fa fa-spinner fa-spin" aria-hidden="true" ></i>' );
            },
            url: SERVER+'/api/reseller/transferDomain',
            type: 'POST',
            dataType: 'JSON',
            data: {domain_name: domain_name,code_transfer:codeTransfer,customer_id : customerId,contact_id:contactId},
            success: function(res){
                console.log(res)
            },//end success
        });
    });//transferDomain



    $(document).on('click','.register_domainBtn',function(e){
        e.preventDefault()
        //domain = 'domaintesting.org';
        var btn = $(this)
        var domain = btn.data('domain')
        var ListBox = btn.parents('.domainListBox')
        var privacy = btn.parents('.domainListBox').find('input[name="purchase-privacy"]').prop('checked');
        var years = btn.parents('.domainListBox').find('select.selectYear').val();
        var contactId = $('#customer-id').val();
        var customerId = $('#contact-id').val();
        alert(" customer = "+customerId+ " contact = "+contactId)
        $.ajax({
            beforeSend: function(){
            },
            url: SERVER+'/api/reseller/registerDomain',
            type: 'POST',
            dataType: 'JSON',
            data: {domain_name: domain,years:years,privacy:privacy,contactId:contactId,customerId:customerId},
            success: function(res){
                console.log(res)
                if(res.result == true){
                    alert("el domain fue creado")
                    ListBox.remove()
                }
            }
        })
        .fail(function( res ) {
            console.log( res.error );
        });
        
    });//end click REGISTER domain

});//end ready