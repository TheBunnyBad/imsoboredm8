var socket;
var enemyColor = "#FF0403";
var myColor = "#0103FF";
var yourTurn = true;
var cnv;

function setup() {
  cnv = createCanvas(canv.width, canv.height);
  cnv.parent('sketch-holder');
  createCells();
  socket = io();
  socket.on('play', enemyPlay);
  socket.on('newMessage', printMessage);
  document.getElementById("chat-submit").onclick=sendMsg;
}


function enemyPlay(enemyBall){
  fill(enemyColor);
  var ball = new Ball(cells[enemyBall.row][enemyBall.column]);
  cells[enemyBall.row][enemyBall.column].ball = ball;
  ball.draw();
  yourTurn = true;
}

function printMessage(msg){
  document.getElementById("messages").innerHTML +=
   "<p class='EnemyColor'>" + "\n"+
      "Enemy said: " + msg +
    "</p>";
}

function mouseClicked(){
  if(yourTurn){
    var cell = findCell(mouseX, mouseY);
    if (cell != null && cell.ball == null){
      fill(myColor);
      var ball = createBall(cell);
      ball.draw()
      socket.emit("play", ball);
      yourTurn = false;
    }
  }
}

class Cell{
  constructor(x, y, width, height, row, column){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fixedX = this.x + this.width/2;
    this.fixedY = this.y + this.height/2;
    this.minX= this.x;
    this.minY= this.y;
    this.maxX= this.x + width;
    this.maxY= this.y + height;

    this.row = row;
    this.column = column;

    this.ball = null;
  }

  drawCell(){
    stroke(cellStyle.borderColor);
    strokeWeight(cellStyle.weight);
    fill(cellStyle.cellBg);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Ball extends Cell{
  constructor(cell){
    super();

    this.x = cell.fixedX;
    this.y = cell.fixedY;
    this.row = cell.row;
    this.column = cell.column;
    this.radius = cellStyle.size.width;
  }

  draw(){
    ellipse(this.x, this.y, this.radius);
  }
}

var gameBoard = {
    rows: 7,
    columns: 6,
    colorP1: "#000000",
    colorP2: "#FFFFFF"
}

var canv = {
  width: 500,
  height: 600
}

var cellStyle = {
  size:{
    width: canv.width / gameBoard.rows,
    height: canv.height / gameBoard.columns
  },
  borderColor: "#000000",
  cellBg: "#FFFFFF",
  weight: 3
}

var cells = new Array();

function createCells(){
  var width = cellStyle.size.width;
  var height =cellStyle.size.height;

  for (var row = 0; row < gameBoard.rows; row++){
    cells[row] = new Array();
  }

  for (var row = 0; row < gameBoard.rows; row++){
    for (var column = 0; column < gameBoard.columns; column++){
        var x = width * row;
        var y = height * column;
        var cell = new Cell(x, y, width, height, row, column);
        cell.drawCell();
        cells[row][column] = cell;
      }
    }
}

function findCell(x, y){
  var pos;
  for (var row = 0; row < gameBoard.rows; row++){
    for (var column = 0; column < gameBoard.columns; column++){
      current = cells[row][column];
      if(x > current.minX && x < current.maxX && y < current.maxY && y > current.minY && !current.hasCircle){
        return current;
      }
    }
  }
}

function createBall(cell){
  var ball = new Ball(cell);

  var realCell = cellToFall(ball);
  var realBall = new Ball(realCell);
  cells[realCell.row][realCell.column].ball = realBall;
  return realBall;
}

function cellToFall(ball){
  var column = ball.column;
  var row = ball.row;
  var canFall = true;
  var cell = cells[row][column];
  while(canFall){
    if(cells[row][column+1] != null){
      if(cells[row][column+1].ball == null){
        var cell = cells[row][column+1];
        column++;
      } else {
        break;
      }
    } else {
      canFall = false;
    }
  }
  return cell;
}

var chat = {
  width: (cnv/2) + 100,
  height: (cnv/2) + 700
}

var mensaje ={
  color: myColor,
  width: 5
}



function sendMsg(e){
    var msg = document.getElementById("chat-input").value;
    document.getElementById("chat-input").value = "";

    document.getElementById("messages").innerHTML +=
    "<p class='MyColor'>" + "\n"+
        "You said: " +msg +
    "</p>";
    socket.emit("newMessage", msg);

}
