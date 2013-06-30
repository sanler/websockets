
/*
 * GET home page.
 */

var fs = require('fs'),
    nconf = require('nconf');

var async = require('async');

nconf.file({ file: './config.json' });

nconf.defaults({
    'port': '6379',
    'host': '10.95.150.224',
    'msg_cache_count': 5
});

var redis = require('redis')
    , client = redis.createClient(nconf.get('port'), nconf.get('host'));


var i=0;

var msgCacheCount = nconf.get('msg_cache_count');

// Extract this method to a utility file
var range = function range(start, end) {
  var result = [];
  for (var i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

exports.index = function(req, res){


  async.map(range(0, msgCacheCount), function (idx, callback) {
      client.get(idx, function (err, data) {
        if (data) {
          var dataObj = JSON.parse(data);
          // We want empty messages?
          if (dataObj.nick && (dataObj.msg != null)) {
            console.log('Retriving Msg: ' + JSON.stringify(dataObj));
            callback(null, dataObj);
          } else {
            callback(null, null);
          }
        } else {
          callback(null, null);
        }
      });
    } ,
    function(err, results){
      res.render('index', {mensajes : results});
  });


// Esto es para arrays en javascript
//    document.write("<P>h= "+(h[0]='Hola')+"<P>");
//    document.write("i[0]="+i[0]+"; i[1]="+i[1]+"; i[2]="+i[2]+"<P>");
//    document.write("Antes de ordenar: "+b.join(', ')+"<P>");
//    document.write("Ordenados: "+b.sort()+"<P>");
//    document.write("Ordenados en orden inverso: "+b.sort().reverse());

};


