
/*
 * GET home page.
 */

var redis = require('redis')
    , client = redis.createClient(6379, '10.95.150.224');

var i=0;
var arrays=[];

exports.index = function(req, res){

   client.get(0, function (err, data) {

       arrays.push(JSON.parse(data));

       client.get(1, function (err, data1) {

           arrays.push(JSON.parse(data1));

           client.get(2, function (err, data2) {

               arrays.push(JSON.parse(data2));

               client.get(3, function (err, data3) {

                   arrays.push(JSON.parse(data3));

                   client.get(4, function (err, data4) {

                       arrays.push(JSON.parse(data4));

                   });
               });

           });

       });

   });


    res.render('index', {mensajes : arrays});


  arrays=[];
// Esto es para arrays en javascript
//    document.write("<P>h= "+(h[0]='Hola')+"<P>");
//    document.write("i[0]="+i[0]+"; i[1]="+i[1]+"; i[2]="+i[2]+"<P>");
//    document.write("Antes de ordenar: "+b.join(', ')+"<P>");
//    document.write("Ordenados: "+b.sort()+"<P>");
//    document.write("Ordenados en orden inverso: "+b.sort().reverse());


};


