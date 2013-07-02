
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/index')
  , http = require('http')
  , path = require('path');



var app = express();
var i=0;



//*********************************************************************
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var async = require('async');
//*********************************************************************

var fs = require('fs'),
nconf = require('nconf');

nconf.file({ file: './/config.json' });

//nconf.defaults({
//  'port': '6379',
//  'host': '10.95.150.224',
//  'msg_cache_count' : 7
//});

var redis = require('redis')
    , client = redis.createClient(nconf.get('port'), nconf.get('host'));
var msgCacheCount = nconf.get('msg_cache_count');
//*********************************************************************

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Extract this method to a utility file
var range = function range(start, end) {
  var result = [];
  for (var i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

app.get('/', routes.index);


//app.get('/chat',  routes.index);
//************************************************************************


//
// Save the configuration object to disk
//


//************************************************************************



io.sockets.on('connection', function(socket){
    socket.emit('connected','conectado'); //Evento creado por nosotros se puede llamar 'pepito'

    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('user message', function(data){

            //console.log(reply.toString()+'ooooooooo');

//            if(i<5){
//
//                client.set(i, JSON.stringify(data), function (err, reply) { });
//                i++;
//            }else{
                    //Cuando llegamos a 5, vamos desplazando la lista hacia arriba para que nos queden siempre los 5 ultimos

      async.eachSeries(range(0,msgCacheCount), function (idx, callback) {
        //console.log(msgCacheCount);
        if (idx != msgCacheCount -1) {
          client.get(idx + 1, function (err, data) {
            if (data) {
              client.set(idx ,data, function (err, reply) {
                callback(err);
              });
            } else{
              client.set(idx ,JSON.stringify({'nick': '', 'msg': ''}), function (err, reply) {
                callback(err);
              });
            }
          });
        } else {
          client.set(idx,JSON.stringify(data), function (err, reply) {
            callback(err);
            console.log('Saving last message.');
          });
        }

      }, function (err) {
        if (err) { throw err; }
        console.log('All messages adjusted.');
      });



//                client.get(1, function (err, data1) {  //cogemos el elemento que hay en el 1 y lo ponemos en el 0
//
//                    client.set(0,data1, function (err, reply) {
//
//                        client.get(2, function (err, data2) {    //cogemos el 2 y lo metemos en 1
//
//                            client.set(1, data2, function (err, reply) {
//
//                                client.get(3, function (err, data3) {  //cogemos el 3 y lo metemos en el 2
//
//                                    client.set(2, data3, function (err, reply) {
//
//                                        client.get(4, function (err, data4) {    //cogemos el 4 y lo metemos en el 3
//
//                                            client.set(3, data4, function (err, reply) {
//
//                                                //Y por ultimo ponemos el nuevo elemento en el 4
//
//                                                client.set(4,JSON.stringify(data), function (err, reply) {
//                                                    console.log('Grabando data en clave 4');
//                                                });
//
//                                            });
//
//                                        });
//
//
//                                    });
//                                });
//
//                            });
//
//                        });
//
//                    });
//
//                });

//                }

        console.log(data);

        //var result=(data.replace('<','&lt;')).replace('>','&gt;');

        io.sockets.emit('user message',data);

    });

//    socket.on('user nick', function(data){
//
//        var result2=(data.replace('<','&lt;')).replace('>','&gt;');
//
//        io.sockets.emit('user nick',result2);
//
//    });

});


//***************************************************************
//io.sockets.on('connection', function (socket) {
//    socket.emit('news','HOLA');
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});
//***************************************************************
  //esta esperando los mensajes que pueda enviar el usuario y cuando ocurre los reenvía a todos los demás usuarios con emit.

//io.sockets.on('user message', function(data){
//  data.emit('user message',data);
//
//});


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
