(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function(CoCreateDomain) {
        	return factory(CoCreateDomain)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateDomain = require("./server.js")
      module.exports = factory(CoCreateDomain);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateDomain) {
  return CoCreateDomain;
}));