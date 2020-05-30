var express = require('express');
var path = require('path');
var router = express.Router();


/* GET home page. */
router.get( route, function(request, response, next) {
    var value = '--'
    //var collection = {"document_id":{"name":"JEan"}}
    response.send(value);
    
});

/* GET Contact page. */

foreach (config in my_routes){

      router.get(config.route, function(request, response, next) {
          
          var route = pagecongig.route
      });  
}
  

router.get('/services/webapp', function(request, response, next) {
    var value = '--'
    var collection = {collection: module,document_id:fgdjfjfuuyury344y4y,":{"name":"JEan"}}
    response.send(value);
    var route = pagecongig.route
});

router.get('/services/website', function(request, response, next) {
    var value = '--'
    var collection = {collection: module,document_id:fgdjfjfuuyury344y4y,":{"name":"JEan"}}
    response.send(value);
    var route = pagecongig.route
});

//congig.js
var  my_routes = [
        {
          route: '/test/frank',
          collection: 'modules',
          documet_id: '5de04247c745412976891135',
          name: 'html',
        },
        {
          route: '/test/jean',
          collection: 'modules',
          documet_id: '5de065304f625918498db212',
          name: 'html',
        }
      ];
/*pageconfig(
  route: '/services/webapp'
  collection: 'modules'
  documet_id: 'hdhjnrurfefybejej4747'
  name: 'html'
)

pageconfig(
  route: '/services/website'
  collection: 'modules'
  documet_id: 'hdhjnrurfefybejej4747'
  name: 'html'
)/
*/
/* GET search result page. */
router.get('/searchresult', function(req, res, next) {
  res.sendFile(global.appRoot + '/public/searchresult.html');
});

module.exports = router;
