
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/index')
  , http = require('http')
  , path = require('path');

var app = express();
//*********************************************************************
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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

app.get('/', routes.index);


//app.get('/chat',  routes.index);

io.sockets.on('connection', function(socket){
    socket.emit('connected','conectado'); //Evento creado por nosotros se puede llamar 'pepito'

    socket.on('my other event', function (data) {
       console.log(data);
   });
    socket.on('user message', function(data){

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
