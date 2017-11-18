var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgs = new Array();

app.use('/public', express.static('public'));
app.set("view engine", "jade");

app.get("/", function(req, res){
  res.render("index", {messages: ["a","b"]});
});

io.on('connection', function(socket){
  console.log("Nueva conexión: " + socket.id);
  socket.on('play', function(ball){
    socket.broadcast.emit('play', ball);
  });

  socket.on("newMessage", function(msg){
    socket.broadcast.emit("newMessage", msg);
  });
});

http.listen(process.env.PORT || 8080, function(){
  console.log("Escuchando en el 8080");
});
