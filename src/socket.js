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
    
    MongoClient
      .connect(mongo_uri, { useNewUrlParser: true, poolSize: 10 })
      .then(client => {
          console.log('connected');
        db = client.db('mydb');
        
        init();
      })
      .catch(error => console.error(error));
}


let user_conecteds = {};

function init() {
  io.on('connection', (socket) => {
    socket.on('joinUser', function(data) {
      let color = usercolors[getRandomInt(0, usercolors.length)]
      //let name = names[getRandomInt(0, names.length)]
      data['socket_id'] = socket.id;
      data['color'] = color;
      data['name'] = data["cursor_user"];
      data['user_id'] = data.user_id;
      // client.hmset(socket.id, 'user', JSON.stringify(data));
      socket.broadcast.to(data['organization_id']).emit('userJoined', data);
    })
    
    
    socket.on('loadCursorServ', function(){
      var socket_id = socket.id
      var ids_sockets = Object.keys(io.sockets.sockets);
      // client.keys('*', function(err, keys) {
      //   var i = 0;
      //   keys.forEach(function (key) {
      //     if (socket_id != key && key != null){
      //         if(ids_sockets.indexOf(key)!=-1){
      //             client.hgetall(key, function (err, data) {
      //               if (data && data.hasOwnProperty('position')){
      //                     data.position = JSON.parse(data.position) 
      //                     data.user = JSON.parse(data.user) 
      //                     user = data.user
      //                     //socket.broadcast.to(room).emit('loadCursorCli', 1);
      //                     socket.emit('loadCursorCli', data);
      //               }
      //             });//end hgetall
      //         }//end ids_sockets
      //         else{
      //           client.del(key);
      //         }
      //     }
      //   });//end forEach
      // });//end KEYS
    });
  
    socket.on('disconnect', function(){
        // client.hgetall(socket.id, function (err, data) {
        //     if(data && data.hasOwnProperty('user')){
        //       user = JSON.parse(data.user)
        //       if(user && user.hasOwnProperty('organization_id')){
        //         room = user["organization_id"]
        //         socket.broadcast.to(room).emit('disconectCli', user);
        //       }
        //     }
        //     client.del(socket.id);
        // });
        
        
    });
    
    
    
    socket.on('changeCursoServ', function(data) {
      console.log("changeCursro server -> ",socket.id)
      data["socket_id"] = socket.id
      client.hget(socket.id, 'user', function(err, reply) {
        data["user"] = JSON.parse(reply);
        client.hmset(socket.id, 'position', JSON.stringify(data),'user',reply);
        //socket.to(data['organization_id']).emit('changeCursoCli', data)
        socket.broadcast.to(data['organization_id']).emit('changeCursoCli', data)
      });
    });
    
    socket.on('joinRoom', function(room) {
      socket.join(room);
      io.to(room).emit('newUserConnected', 'user connected '+socket.id);
    })

    /** CRUD Functions **/

    socket.on('createDocument', (data) => createDocument(socket, data))
    socket.on('readDocument', (data) => readDocument(socket, data))
    socket.on('updateDocument', (data) => updateDocument(socket, data))
    socket.on('deleteDocument', (data) => deleteDocument(socket, data))
    
    //  will use readDocument? --- can be removed?
    socket.on('getDocument', (data) => getDocument(socket, data))
    
    // used by templating.js, filter.js, datatables.js, calendar.js
    socket.on('readDocumentList', (data) => readDocumentList(socket, data))

    ///////// special functions
    socket.on('checkUnique', (data) => checkUnique(socket, data)) 
    socket.on('login', (data) => login(socket, data))
    socket.on('usersCurrentOrg', (data) => usersCurrentOrg(socket, data))

    /// window
    socket.on('openWindow', (data) => openWindow(socket, data))
    socket.on('windowBtnEvent', (data) => windowBtnEvent(socket, data))

    // builder
    socket.on('fetchInfoForBuilder', (data) => fetchInfoForBuilder(socket, data))

    /// users
    socket.on('fetchUser', (data) => fetchUser(socket, data))

    //// industry
    socket.on('createIndustry', (data) => createIndustry(socket, data))
    socket.on('buildIndustry', (data) => buildIndustry(socket, data))
    
    //by jin
    socket.on('sendMessage', (data) => sendMessage(socket, data));
    socket.on('sendGeneralMessage', (data) => sendGeneralMessage(socket, data));
  })
}

async function checkUnique(socket, data) {
  var securityRes = await checkSecurity(data)
  if (!securityRes.result) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  //console.log(data);
  
  var collection = db.collection(data["collection"]);
    
  var query = {
    [data['name']]: data['value']
  };
  
  if (securityRes['organization_id']) {
    query['organization_id'] = securityRes['organization_id'];
  }
  
  collection.find(query).toArray(function(error, result) {
    if (!error && result) {
      if (result.length == 0) {
        socket.emit('checkedUnique', {
          form_id: data['form_id'],
          name: data['name'],
          unique: true
        })
      } else {
        socket.emit('checkedUnique', {
          form_id: data['form_id'],
          name: data['name'],
          unique: false
        })
      }
    }
    
    
  })
}

async function login(socket, data) {
  
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    
    socket.emit('securityError', 'error');
    return;   
  }

  // console.log(socket.handshake.address);
  // console.log('remote address');  
  // console.log(socket.request.connection.remoteAddress);
  
  try {
    
    var collection = db.collection(data["data-collection"]);
    
    var query = new Object();
    
    if (securityRes['organization_id']) {
      query['organization_id'] = securityRes['organization_id'];
    }
    
    // query['connected_orgs'] = data['organization_id'];
    
    // if (data['data-document_id']) {
    //   query['data-document_id'] = new ObjectID(data['data-module']);
    // } 
    
    for (var key in data['loginData']) {
      query[key] = data['loginData'][key];
    }
    
    collection.find(query).toArray(function(error, result) {
      
      if (!error && result) {
        if (result.length > 0) {
          socket.emit('login', {
            eId: data['eId'],
            success: true,
            id: result[0]['_id'],
            current_org: result[0]['current_org']
          }); 
          
          //var org_id = result[0]['current_org'];
          
          
        } else {
          socket.emit('login', {
            form_id: data['form_id'],
            success: false
          });  
        }
      } else {
        socket.emit('login', {
          form_id: data['form_id'],
          success: false
        });
      }
    });
  } catch (error) {
    //console.log(error);
  }
}

async function usersCurrentOrg(socket, data) {
  try {
    
    var collection = db.collection(data["data-collection"]);
    
    var query = new Object();
    
    query['_id'] = new ObjectID(data['user_id']);
    
    console.log(query);
    
    collection.find(query).toArray(function(error, result) {
    
      if (!error && result) {
        
        if (result.length > 0) {
          var org_id = result[0]['current_org'];
          
          var orgCollection = db.collection('organizations');
          
          orgCollection.find({"_id": new ObjectID(org_id),}).toArray(function(err, res) {
            if (!err && res) {
              if (res.length > 0) {
                socket.emit('usersCurrentOrg', {
                  success: true,
                  user_id: result[0]['_id'],
                  current_org: result[0]['current_org'],
                  apiKey: res[0]['apiKey'],
                  securityKey: res[0]['securityKey'],
                  adminUI_id: res[0]['adminUI_id'],
                  builderUI_id: res[0]['builderUI_id']
                }); 
              }
            }
          });
        } else {
          // socket.emit('loginResult', {
          //   form_id: data['form_id'],
          //   success: false
          // });  
        }
      } else {
        // socket.emit('loginResult', {
        //   form_id: data['form_id'],
        //   success: false
        // });
      }
    });
    
    
  } catch (error) {
    
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



async function openWindow(socket, data) {
  if (!await checkSecurity(data)) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {
    io.emit('openWindow', data.data);
  } catch (error) {
    
  }
}

async function windowBtnEvent(socket, data) {
   if (!await checkSecurity(data)) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {
    io.emit('windowBtnEvent', data.data);
  } catch (error) {
    
  }
}

async function fetchInfoForBuilder(socket, data) {

  if (!await checkSecurity(data)) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {
      
      var collectionList = [];
      var modules = [];
      db.listCollections().toArray(function(err, collInfos) {
        
        collInfos.forEach(function(colInfo) {
          collectionList.push(colInfo.name);
        })
        
        var modulesCollection = db.collection('modules');
        modulesCollection.find().toArray(function(error, result) {
          result.forEach(function(item) {
            modules.push({
              _id: item['_id'],
              name: item['name']
            })
          })
          
          socket.emit('fetchedInfoForBuilder', {
            collections: collectionList,
            modules: modules
          });
        })
      });
    
      
    
    
  } catch (error) {
    
  }
}

async function fetchUser(socket, data) {
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {

    
    var collection = db.collection(data['data-collection']);
    
    var user_id = data['user_id'];
    
    
    var query = {
      "_id": new ObjectID(user_id),
    }
    
    if (securityRes['organization_id']) {
      query['organization_id'] = securityRes['organization_id'];
    }
    
    collection.findOne(query, function(error, result) {
      
      
      socket.emit('fetchedUser', result);
    })
  } catch (error) {
    
  }
}



////   new functions
async function readDocument(socket, data){
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'invalide security');
    return;
  }
  
  var selectors = {'_id' : new ObjectID(data["document_id"])};
  if(securityRes['organization_id']) selectors['organization_id'] = securityRes['organization_id'];
  
  try{
    
    var collection = db.collection(data['collection']);
    
    collection.findOne(selectors, {fields: data.filters}).then((result) => {
      socket.emit('readDocument', {
        'collection'  : data['collection'],
        'document_id' : data['document_id'],
        'data'        : result || {},
        'element'     : data['element'],
        'metadata'    : data['metaData']
      });
    });

  }catch(error){
    socket.emit('securityError', error);
  }
}


// async function getDocumentList(socket, data) {
//   var securityRes = await checkSecurity(data);
//   if (!securityRes.result) {
    
//     socket.emit('securityError', 'error');
//     return;   
//   }
  
//   try {
    
//     var collection = db.collection(data['data-collection']);
    
//     var query = getQuery(data);
    
//     if (securityRes['organization_id']) {
//       query['organization_id'] = securityRes['organization_id'];
//     }
    
//     var sort = {};
//     if (data['order']) {
//       sort = {
//         [data['order']['name']]: data['order']['type']
//       }  
//     }
    
//     collection.find(query).sort(sort).toArray(function(error, result) {
//       if (result) {
        
//         var result = getSearch(result, data['searchKey']);
        
//         var startIndex = data['startIndex'];
//         var count = data['count'];
        
//         if (startIndex) {
//           result = result.slice(startIndex, result.length);
//         }
        
//         if (count) {
//           result = result.slice(0, count);
//         }
        
//         socket.emit('getDocumentList', {
//           'data-collection': data['data-collection'],
//           'eId': data['eId'],
//           'result': result
//         })
//       }
      
//       //console.log(error);
//     })
    
    
    
    
//   } catch (error) {
    
//   }
  
// }

// function getQuery(data) {
//   var query = new Object();
//   if (data['data-collection'] == 'module_activity' && data['module_id']) {
//     query['data-document_id'] = data['module_id'];
//   }
  
//   var filters = data['filters'];
  
//   for (var key in filters) {
//     var filter = filters[key];
    
//     if (filter.type == 'array' && filter.value.length > 0) {
//       query[key] = {$in: filter.value};
//     } else if (filter.type == 'range') {
//       if (filter.value[0] && filter.value[1]) {
        
//         query[key] = {$gte: filter.value[0], $lte: filter.value[1]}  
        
//       } else if (filter.value[0]) {
        
//         query[key] = {$gte: filter.value[0]};
        
//       } else if (filter.value[1]) {
        
//         query[key] = {$lte: filter.value[1]};
        
//       }
//     }
//   }
  
//   var exclusion = data['exclusion'];
//   if (exclusion) {
//     var name = exclusion['name'];
//     var value = exclusion['value'];
    
//     query[name] = {$nin: value};
//   }
  
//   return query;
// }

// function getSearch(results, searchKey) {
//   var tmp
//   if (typeof searchKey!== 'undefined') {
        
//     tmp = results.filter(function(item) {
    
//       for (var key in item) {
//         if (typeof item[key] == 'string') {
//           var value = item[key].toUpperCase();
//           if (value.indexOf(searchKey.toUpperCase()) > -1) return true;
//         }
        
//       }
      
//       return false;
//     })  
//   } else {
//     tmp = results;
//   }
  
//   return tmp;
// }

async function createDocument(socket, data){
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'error');
    return;
  }
  
  console.log('createDocument requested: ', data.data);
  if(!data.data) return;
  
  try{
    var collection = db.collection(data['collection']);
    
    collection.insertOne(data.data, function(error, result){
      if(!error && result){
        const response  = {
          'collection': data['collection'],
          'element': data['element'],
          'document_id': result.ops[0]._id,
          'data': result.ops[0],
          'metadata': data['metadata']
        };
        
        socket.emit('createDocument', response);
        socket.broadcast.to(data['organization_id']).emit('createDocument', response);
      }
      
    });
  }catch(error){
    console.log('createDocument error', error);
  }
}

async function updateDocument(socket, data) {
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'invalide security');
    return;
  }
  
  try {
    
    var collection = db.collection(data["collection"]);
    
    var query = {"_id": new ObjectID(data["document_id"]) };
    if (securityRes['organization_id']) query['organization_id'] = securityRes['organization_id'];
    
    var update = {};
    if( data['set'] )   update['$set'] = data['set'];
    if( data['unset'] ) update['$unset'] = data['unset'].reduce((r, d) => {r[d] = ""; return r}, {});

    collection.findOneAndUpdate(
      query,
      update,
      {returnOriginal : false}
    ).then((result) => {

      let response = {
        'collection'  : data['collection'],
        'document_id' : data['document_id'],
        'data'        : result.value || {},
        'metadata'    : data['metadata']
      };
      
      if(data['unset']) response['delete_fields'] = data['unset'];
      
      socket.emit('updateDocument', {...response, element: data['element']});
      
      if(securityRes['organization_id'])
        socket.broadcast.to(securityRes['organization_id']).emit('updateDocument', response);
      else 
        socket.broadcast.emit('updateDocument', response);
    });
    
  } catch (error) {
    socket.emit('updateDocument error', error);
  }
}

async function deleteDocument(socket, data) {
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'error');
    return;   
  }

  try {
    var collection = db.collection(data["collection"]);
    var query = {
      "_id": new ObjectID(data["document_id"])
    };
    if (securityRes['organization_id']) {
      query['organization_id'] = securityRes['organization_id'];
    }
    
    collection.deleteOne(query, function(error, result) {
      if (!error) {
        let response = {
            'collection': data['collection'],
            'document_id': data['document_id'],
            'metadata': data['metadata']
          }
        socket.emit('deleteDocument', { ...response, element: data['element']});
        socket.broadcast.to(data['organization_id']).emit('deleteDocument', response);
        // io.to(data['organization_id']).emit('deleteDocument', response)
      }
    })
  } catch (error) {
    console.log(error);
  }
}

async function getDocument(socket, data) {
  if (!data['collection'] || data['collection'] == 'null' || typeof data['collection'] !== 'string') {
    return;
  } 
  
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {

    const collection = db.collection(data["collection"]);
    var query = {
      "_id": new ObjectID(data["document_id"])
    };
    if (securityRes['organization_id']) {
      query['organization_id'] = securityRes['organization_id'];
    }
    
    collection.find(query).toArray(function(error, result) {
      if (!error && result) {
        if (result.length > 0) {
          let tmp = result[0];
          if (data['exclude_fields']) {
            data['exclude_fields'].forEach(function(field) {
              delete tmp[field];
            })
          }
          socket.emit('getDocument', {
            'collection'  : data['collection'],
            'document_id' : data['document_id'],
            'data'        : tmp,
            'metadata'    : data['metadata']
          }); 
        }
      } 
    });
  } catch (error) {
    console.log('getDocument error', error); 
  }
}

async function createIndustry(socket, data) {
  // console.log(data);
  
  // var securityRes = await checkSecurity(data);
  
  // if (!securityRes.result) {
  //   
  //   socket.emit('securityError', 'error');
  //   return;   
  // }
  
  try {
    console.log('createIndustry');
      
    var industryId = data['industry_id'];
    
    console.log(industryId);
    
    insertDocumentsToIndustry('module_activity', industryId, data['organization_id']);
    insertDocumentsToIndustry('modules', industryId, data['organization_id']);
    //insertDocumentsToIndustry('users', industryId, data['organization_id']);
    
    
    
  } catch (error) {
    console.log(error);
  }
}

async function insertDocumentsToIndustry(collectionName, industryId, organizationId) {
  
  var industryDocumentsCollection = db.collection('industry_documents');
  var collection = db.collection(collectionName);
  
  var query = {
    'organization_id': organizationId
  }
  
  var documents = await collection.find(query).toArray();
  
  for (var i=0; i < documents.length; i++) {
    var document = documents[i];
    
    var documentId = document['_id'];
    
    delete document['_id'];
    
    document['document_id'] = documentId.toString();
    
    document['industry_id'] = industryId;
    document['collection_name'] = collectionName;
    
    industryDocumentsCollection.insertOne(document);
  }
  
}

async function buildIndustry(socket, data) {
  var securityRes = await checkSecurity(data);
  
  if (!securityRes.result) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  
  var industryDocumentsCollection = db.collection('industry_documents');
  var industryDocuments = await industryDocumentsCollection.find({"industry_id": data['industry_id']}).toArray();
  
  console.log('industry document count: ' + industryDocuments.length);
  
  
  
  var result = await createEmptyDocumentsFromIndustry(data['industry_id'], data['new_organization_id']);
  
  
  var adminUI_id = result.adminUI_id;
  var builderUI_id = result.builderUI_id;
  var idPairs = result.idPairs;
  
  await updateDocumentsByIndustry(idPairs);
  
  await removeFieldsForIndustry(idPairs);
  
  socket.emit('buildIndustry', {
    adminUI_id: adminUI_id,
    builderUI_id: builderUI_id,
    industry_id: data['industry_id']
  })
}

async function createEmptyDocumentsFromIndustry(industryId, newOrganizationId) {
  // var industryId = data['industry_id'];
  
  var industryDocumentsCollection = db.collection('industry_documents');
  
  var industryDocuments = await industryDocumentsCollection.find({"industry_id": industryId}).toArray();

  var adminUI_id = '';
  var builderUI_id = '';
  
  var idPairs = [];
  
  for (var i=0; i < industryDocuments.length; i++) {
    var document = industryDocuments[i];
    
    var collection = db.collection(document['collection_name']);
    
    
    delete document['_id'];
    delete document['organization_id'];
    delete document['industry_id'];
    
    document['old_document_id'] = document['document_id'];
    delete document['document_id'];
    
    var result = await collection.insertOne({
      organization_id: newOrganizationId,
      ...document
    });
    
    if (result) {
      
      if (result['ops'][0].name == 'Admin UI') {
        adminUI_id = result['ops'][0]['_id'];
      } else if (result['ops'][0].name == 'Builder UI') {
        builderUI_id = result['ops'][0]['_id'];
      }
      
      idPairs.push({
        new_document_id: result['ops'][0]['_id'].toString(),
        old_document_id: result['ops'][0]['old_document_id'],
        collection_name: document['collection_name']
      })
    }
  }

  return {
    adminUI_id: adminUI_id,
    builderUI_id: builderUI_id,
    idPairs: idPairs
  }
}

async function updateDocumentsByIndustry(idPairs) {
  
  
  for (var i=0; i < idPairs.length; i++) {
    var idPair = idPairs[i];
    
    var collection = db.collection(idPair['collection_name']);
    
    var updatedField = [];
    
    var document = await collection.findOne({'_id': ObjectID(idPair['new_document_id'])});
    
    for (var field in document) {
      
      if (field != '_id' && field != 'organization_id' && field != 'collection_name' && field != 'old_document_id') {
        var fieldValue = document[field];
        
        var newFieldValue = replaceId(fieldValue, idPairs);
        
        
        document[field] = newFieldValue;
      }
    }
    
    delete document['_id'];
    
    await collection.findOneAndUpdate({'_id': ObjectID(idPair['new_document_id'])}, {$set: document});
  }
}

async function removeFieldsForIndustry(idPairs) {
    for (var i=0; i < idPairs.length; i++) {
      var idPair = idPairs[i];
      
      var collection = db.collection(idPair['collection_name']);
      
      await collection.findOneAndUpdate({'_id': ObjectID(idPair['new_document_id'])}, {$unset: {"old_document_id": "", "collection_name": ""}});
    }
}

/** Jean needs to check **/
function replaceId(fieldValue, idPairs) {
  
  var type = typeof fieldValue;

  if (type == 'string') {

    for (var i=0; i<idPairs.length; i++) {
      var idPair = idPairs[i];
      fieldValue = fieldValue.replace(new RegExp(idPair['old_document_id'], 'g'), idPair['new_document_id']);    
    }
  } else if (type == 'object') {
    for (var key in fieldValue) {
      for (var i=0; i<idPairs.length; i++) {
        var idPair = idPairs[i];
        
        if (fieldValue[key]) fieldValue[key] = fieldValue[key].replace(new RegExp(idPair['old_document_id'], 'g'), idPair['new_document_id']);    
      }
    }
    
    
  }
  
  return fieldValue;
}

let usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' }
]
let names = ['Jean','Pedro','Frank','Jose','Vicenta','Petronila','Yulin','Cloy','Euro','Bastidas','Barbie','Man','Capitan']
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * By jin
 * 
  data: {
    collection: "modules",
    element: "xxxx",
    metadata: "",
    operator: {
      fetch: {
        name: 'xxxx',
        value: 'xxxxx'
      },
      filters: [{
        name: 'field1',
        operator: "contain | range | eq | ne | lt | lte | gt | gte | in | nin",
        value: [v1, v2, ...]
      }, {
        ....
      }],
      orders: [{
        name: 'field-x',
        type: 1 | -1
      }],
      search: {
        type: 'or | and',
        value: [value1, value2]
      },
      
      startIndex: 0 (integer),
      count: 0 (integer)
    },
    
    is_collection: true | false,
    //. case fetch document case
    created_ids : [id1, id2, ...],
    
    -------- additional response data -----------
    data: [] // array
 }
 **/
async function readDocumentList(socket, data) {
  var securityRes = await checkSecurity(data);
  if (!securityRes.result) {
    socket.emit('securityError', 'error');
    return;   
  }
  
  if (data['is_collection']) {
    var result = await fetchCollectionList();
    socket.emit('readDocumentList', {
      'collection': data['collection'],
      'element': data['element'],
      'data': result,
      'operator': data.opreator,
      'is_collection': data.is_collection,
      'metadata': data.metadata
    })
    return;
  }
  
  try {
    
    var collection = db.collection(data['collection']);
    const operator = data.operator;
    
    var query = {};
    query = readQuery(operator);
    
    if (operator['fetch'] && operator.fetch.name) {
      query[operator.fetch.name] = operator.fetch.value;
    }
    
    if (securityRes['organization_id']) {
      query['organization_id'] = securityRes['organization_id'];
    }
    
    var sort = {};
    operator.orders.forEach((order) => {
      sort[order.name] = order.type
    });

    collection.find(query).sort(sort).toArray(function(error, result) {
      if (result) {
        if (operator['search']['type'] == 'and') {
          result = readAndSearch(result, operator['search']['value']);
        } else {
          result = readOrSearch(result, operator['search']['value']);
        }
        
        const total = result.length;
        const startIndex = operator.startIndex;
        const count = operator.count;
        let result_data = [];
        
        if (data.created_ids && data.created_ids.length > 0) {
          let _nn = (count) ? startIndex : result.length;
          
          for (let ii = 0; ii < _nn; ii++) {
            
            const selected_item = result[ii];
            data.created_ids.forEach((fetch_id, index) => {
              if (fetch_id == selected_item['_id']) {
                result_data.push({ item: selected_item, position: ii })
              }
            })
          }
        } else {
          
          if (startIndex) result = result.slice(startIndex, total);
          
          if (count) result = result.slice(0, count)
          
          result_data = result;
        }

        socket.emit('readDocumentList', {
          'collection': data['collection'],
          'element': data['element'],
          'data': result_data,
          'operator': {...operator, total: total},
          'metadata': data['metadata'],
          'created_ids': data['created_ids'],
          'is_collection': data['is_collection']
        })
      }
      
      //console.log(error);
    })
  } catch (error) {
    console.log('readDocumentList error', error);
  }
}

async function fetchCollectionList() {
  try {
    var result_collections = [];
    result_collections = await db.listCollections().toArray().then(infos => {
      var result = [];
      infos.forEach(function(item) {
        let __uuid = item.info.uuid.toString('hex')
        result.push({
          name: item.name,
          _id: __uuid,
          id: __uuid,
        });
      })
      return result;
    })
    return result_collections;
  } catch(error) {
    
  }
}

/**
 * fetch document by ids
 */

// async function fetchDocumentList(socket, data) {
//   var securityRes = await checkSecurity(data);
//   if (!securityRes.result) {
//     socket.emit('securityError', 'error');
//     return;   
//   }
  
//   try {
    
//     var collection = db.collection(data['data-collection']);
//     var query = {};
//     query = readQuery(data);
    
//     if (data['fetch'] && data.fetch.name) {
//       query[data.fetch.name] = data.fetch.value;
//     }
    
//     if (securityRes['organization_id']) {
//       query['organization_id'] = securityRes['organization_id'];
//     }
    
//     var sort = {};
//     data.orders.forEach((order) => {
//       sort[order.name] = order.type
//     });

//     collection.find(query).sort(sort).toArray(function(error, result) {
//       if (result) {
//         if (data['search']['type'] == 'and') {
//           result = readAndSearch(result, data['search']['value']);
//         } else {
//           result = readOrSearch(result, data['search']['value']);
//         }

//         var total = result.length;
//         var f_ids = data['fetch_ids'];
        
//         var _nn = result.length;
//         if (data['count']) {
//           _nn = data['startIndex'];
//         }
//         console.log(f_ids);
//         var ret_data = [];
//         for (let ii = 0; ii < _nn; ii++) {
          
//           for (let j = 0; j < f_ids.length; j++) {
            
//             console.log(f_ids[j], result[ii]['_id']);
//             if (f_ids[j] == result[ii]['_id']) {
              
//               ret_data.push({item: result[ii], position: ii});
              
//             }
//           }
//         }
        
//         console.log(ret_data);
      
//         socket.emit('fetchDocumentList', {
//           'data-collection': data['data-collection'],
//           'eId': data['eId'],
//           'result': ret_data,
//           'startIndex': data['startIndex'],
//           'per_count': data['count'],
//           'total': total,
//           'options': data['options']
//         })
//       }
      
//       //console.log(error);
//     })
//   } catch (error) {
    
//   }
  
// }

/**
 * function that make query from data
 * 
 */
function readQuery(data) {
  var query = new Object();

  var filters = data['filters'];
  
  filters.forEach((item) => {
    if (!item.name) {
      return;
    }
    var key = item.name;
    if (!query[key]) {
      query[key] = {};
    }
    
    switch (item.operator) {
      case 'contain':
        var in_values = [];
        item.value.forEach(function(v) {
          in_values.push(new RegExp(".*" + v + ".*"));
        });
        
        query[key] = {$in : in_values }
        break;
        
      case 'range':
        if (item.value[0] !== null && item.value[1] !== null) {
          query[key] = {$gte: item.value[0], $lte: item.value[1]};
        } else if (item.value[0] !== null) {
          query[key] = {$gte: item.value[0]};
        } else if (item.value[1] !== null) {
          query[key] = {$lte: item.value[1]};
        }
        break;
        
      case 'eq':
      case 'ne':
      case 'lt':
      case 'lte':
      case 'gt':
      case 'gte':
        query[key]["$" + item.operator] = item.value[0];
        break;
      case 'in':
      case 'nin':
        query[key]["$" + item.operator] = item.value;
        break;
    }    
  })

  //. global search
  //. we have to set indexes in text fields ex: db.chart.createIndex({ "$**": "text" })
  // if (data['searchKey']) {
  //   query["$text"] = {$search: "\"Ni\""};
  // }
  
  console.log(query)
  return query;
}


//. or operator
function readOrSearch(results, search) {
  var tmp
  if (search && search.length > 0) {

    tmp = results.filter(function(item) {
      
      for (var key in item) {
        var value = item[key];
        var __status = false;
        
        var str_value = value;
        
        if (Array.isArray(str_value) || typeof str_value == 'number') {
          str_value = str_value.toString();
        }
        
        if (typeof str_value == 'string') {
          str_value = str_value.toUpperCase();
        }

        for (let i = 0; i < search.length; i++) {
          if (typeof search[i] == 'string' && typeof str_value == 'string') {
            if (str_value.indexOf(search[i].toUpperCase()) > -1) {
              __status = true;
              break;
            }
          } else {
            if (value == search[i]) {
              __status = true;
              break;
            }
          }
        }
        
        if (__status) {
          return true;
        }
      }
      
      return false;
    })  
  } else {
    tmp = results;
  }
  
  return tmp;
}


//. and operator
function readAndSearch(results, search) {
  var tmp
  if (search && search.length > 0) {
        
    tmp = results.filter(function(item) {

      for (let i = 0; i < search.length; i++) {
        var __status = false;
        
        for (var key in item) {
          var value = item[key];
          
          if (typeof search[i] == 'string') {
            
            if (Array.isArray(value) || typeof value == 'number' ) {
              value = value.toString();
            } 
            
            if (typeof value == 'string') {
              value = value.toUpperCase();  
              if (value.indexOf(search[i].toUpperCase()) > -1) {
                __status = true;
                break;
              }
            }
            
          } else {
            if (value == search[i]) {
              __status = true;
              break;
            }
          }
        }
        
        if (!__status) {
          return false;  
        }
      }
      
      return true;
    })  
  } else {
    tmp = results;
  }
  
  return tmp;
}

async function sendMessage(socket, data) {
   if (!await checkSecurity(data)) {
    
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {
    socket.broadcast.to(data['organization_id']).emit('receiveMessage', data.data)
  } catch (error) {
    
  }
}

async function sendGeneralMessage(socket, data) {
  if (!await checkSecurity(data)) {
    socket.emit('securityError', 'error');
    return;   
  }
  
  try {
    if (!data.emit) {
      return ;
    }
    
    let type = data.type || 'socket' ;
    type = (data.namespace) ? 'io' : type;

    let instance_socket = (type == 'io') ? io : socket;
    
    if (data.namespace) {
      instance_socket.of(data.namespace);
    }
    
    switch (data.operator) {
      case 'broadcast':
        instance_socket = instance_socket.broadcast;
        break;
      default:
    }
    
    const emit_info = data.emit;
    if (data.rooms) {
      //. send rooms
      data.rooms.forEach((room) => {
        let emit_instance = instance_socket.to(room);
        if (type == 'io') {
          emit_instance = instance_socket.in(room);
        } 
        emit_instance.emit(emit_info.message, emit_info.data);
      })
    } else {
      //. sender client
      instance_socket.emit(emit_info.message, emit_info.data);
    }
    
    if (data.socket_ids && type == 'io') {
      //. send sockets
      data.socket_ids.forEach((socket_id) => {
        io.to(socket_id).emit(emit_info.message, emit_info.data);
      })
    }
  } catch (error) {
    console.log('sendGeneralMessage Error', error);
  }
}

