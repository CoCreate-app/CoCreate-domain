var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var redis = require('redis');
var client = redis.createClient(config.redis); //creates a new client
var io;

var db;
var ObjectID = require('mongodb').ObjectID;
const {Binary} = require("mongodb");

module.exports.socket = function(_io) {
        
    var mongo_uri = config.db_url;
    io = _io;
    
    /*MongoClient
      .connect(mongo_uri, { useNewUrlParser: true, poolSize: 10 })
      .then(client => {
          console.log('connected');
        db = client.db('mydb');
        */
        init();
      /*})
      .catch(error => console.error(error));
      */
}


let user_conecteds = {};

function init() {
  io.on('connection', (socket) => {
        console.log("Conecto al server")
        try {
          require('./controllers/sockets/Cocreate-reseller')({'io':io,'socket':socket})
        } catch (err) {
          console.error('Error import Cocreate-socket-modules')
        }
        socket.on('pingSocket',function(data){
        console.log('response from pingSocket ',data)
        socket.emit('pingSocketResponse',{'kery':'from server'});
    })//end


  })
}


async function TemplateFunction(socket, data){
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'invalide security');
    return;
  }
  var selectors = {'_id' : new ObjectID(data["document_id"])};
  if(securityRes['organization_id']) selectors['organization_id'] = securityRes['organization_id'];
  try{
    //YOUR CODE
  }catch(error){
    socket.emit('securityError', error);
  }
}



async function checkSecurity(data) {
  
  //return true;

  var apiKey = data['apiKey'];
  var securityKey = data['securityKey'];
  var organization_id = data['organization_id'];
  
  if (!apiKey || !securityKey || !organization_id) return {result: false};
  
  var collection = db.collection('organizations');
  
  try {
    var query = {
      "_id": new ObjectID(organization_id),
      "apiKey": data['apiKey'],
      "securityKey": data['securityKey'],
    }
  
    const result = await collection.find(query).toArray();
  
    if (result && result.length > 0) {
      
      if (data['collection'] == 'users' || data['collection'] == 'organizations') {
        return {
          result: true,
        }  
      } else {
        return {
          result: true,
          organization_id: data['organization_id']
        }  
      }
      
      
    }
       
    return {result: false};
     
  } catch (error) {
    
  }
   
  return {result: false};
}

