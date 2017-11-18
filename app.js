var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static('public'));
app.set("view engine", "jade");

app.get("/", function(req, res){
  res.render("index");
});

io.on('connection', function(socket){
  console.log("Nueva conexión: " + socket.id);
  socket.on('play', function(cell){
    socket.broadcast.emit('play', cell);
  });

  socket.on('disconnect', function(dis){
    console.log("Se fue");
  })
});

http.listen(process.env.PORT || 3000, function(){
  console.log("Escuchando en el 3000");
});
