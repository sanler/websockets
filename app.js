
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/index')
  , http = require('http')
  , path = require('path');

var redis = require('redis')
    , client = redis.createClient(6379, '10.95.150.224');

var app = express();
var i=0;

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




            //console.log(reply.toString()+'ooooooooo');

//            if(i<5){
//
//                client.set(i, JSON.stringify(data), function (err, reply) { });
//                i++;
//            }else{
                    //Cuando llegamos a 5, vamos desplazando la lista hacia arriba para que nos queden siempre los 5 ultimos


                client.get(1, function (err, data1) {  //cogemos el elemento que hay en el 1 y lo ponemos en el 0

                    client.set(0,data1, function (err, reply) {

                        client.get(2, function (err, data2) {    //cogemos el 2 y lo metemos en 1

                            client.set(1, data2, function (err, reply) {

                                client.get(3, function (err, data3) {  //cogemos el 3 y lo metemos en el 2

                                    client.set(2, data3, function (err, reply) {

                                        client.get(4, function (err, data4) {    //cogemos el 4 y lo metemos en el 3

                                            client.set(3, data4, function (err, reply) {

                                                //Y por ultimo ponemos el nuevo elemento en el 4

                                                client.set(4,JSON.stringify(data), function (err, reply) {
                                                    console.log('Grabando data en clave 4');
                                                });

                                            });

                                        });


                                    });
                                });

                                });


                        });

                    });

                });






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
