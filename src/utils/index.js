const axios = require('axios');
/*
module.exports.req_get=(url,res,opt)=>{
    axios.get(url)
      .then(function (response) {
        send_success(res,{result :  true,data : response.data,'class':opt});
      })
      .catch(function (error) {
        send_error(res,{result :  false,errors : error.data,'class':opt});
      });
}

module.exports.req_delete=(url,res,opt)=>{
    axios.delete(url)
      .then(function (response) {
        send_success(res,{result :  true,data : response.data,'class':opt});
      })
      .catch(function (error) {
        send_error(res,{result :  false,errors : error.data,'class':opt});
      });
}
*/
module.exports.req=(url,method,params,socket,send_response,data_original)=>{
    
    console.log("Send Req "+method+" AXIOS");
    axios({
          method: method,
          url: url,
          data: params
    }).then(function (response) {
        console.log("Succes")
        send_response(socket,{result :  true,response : response.data,'data_request':data_original},send_response);
        
    }).catch(function (error) {
        console.log("Error",error.data)
        send_response(socket,{result :  false,response : error.data,'data_request':data_original},send_response);
    });
}

var send_response=(socket,obj,send_response)=>{
  console.log("Response   -> "+send_response)
  console.log("Object    ->", obj)
  socket.emit(send_response,obj)
}

/*var send_error=(res,obj)=>{
  console.log("error  ")
  socket.emit('email',obj)
  //res.send(obj);
}*/


var send_error=(socket,obj,send_response)=>{
  // console.log("error  ",obj)
  let result = obj;
  // delete result.error['request'];// when error, obj too large
  // let result = {type:obj.type, error:obj.error};
  socket.emit(send_response,result)
  //res.send(obj);
}

module.exports.send_response = send_response;
module.exports.send_error = send_error;