var utils = require("./utils.js");


module.exports.getRoute = async (req, res, next) => {
    
    
    /*
    db.organizations.findOneAndUpdate(
       { _id:ObjectId('5de0387b12e200ea63204d6c') },
       { $set: { "routes" : [{
                        route: '/test/frank',
                        collection: 'module_activities',
                        document_id: "5e4802ce3ed96d38e71fc7e5",
                        name: 'name1',
                      },
                      {
                        route: '/hello/jean',
                        collection: 'modules',
                        document_id: '5de03fc7c745412976891134',
                        name: 'html',
                      }]} },
       {  upsert:true, returnNewDocument : true }
    );
    */
    
    console.log("URL=> ",req.url , " req.hostname ", req.hostname)
    let route_uri = req.url.split('/organization')[1];
    let organization_id = '5de0387b12e200ea63204d6c';
    
    var org = await utils.getDocument({'collection':'organizations','document_id':organization_id});
    var route = org.routes.find(element => element.route.toLowerCase() == route_uri);
    if (typeof route != 'undefined'){
        console.log(" ROute ",route);
        var result = await utils.getDocument(route);
        res.send(result[route.name]);
    }
    else {
        let list_route = '<ul>'
        org.routes.forEach(function(route) {   
            list_route += '<li>'+route.route+'</li>';
        });
        list_route += '</ul>'
            res.send('No Found this ROute in ours BD '+list_route);
    }
}
