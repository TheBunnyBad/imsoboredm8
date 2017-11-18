var socket;
var enemyColor = "#FF0403";
var myColor = "#0103FF";
var yourTurn = true;

function setup() {
  createCanvas(canv.width, canv.height);
  createCells();
  socket = io();
  socket.on('play', enemyPlay);
}

function enemyPlay(cell){
  fill(enemyColor);
  ball.drawBall(cell);
  console.log(cell);
  cells[cell.row][cell.column].hasCircle = true;
  console.log(cells[cell.row][cell.column]);
  yourTurn = true;
}

function mouseClicked(){
  if(yourTurn){
    var cell = findCell(mouseX, mouseY);
      if (cell != null){
        socket.emit("play", cell);
        fill(myColor);
        ball.drawBall(cell);
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

    this.hasCircle = false;
  }

  drawCell(){
    stroke(cellStyle.borderColor);
    strokeWeight(cellStyle.weight);
    fill(cellStyle.cellBg);
    rect(this.x, this.y, this.width, this.height);
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

var ball = {
  radius: cellStyle.size.width,
  drawBall: function(cell){
    ellipse(cell.fixedX, cell.fixedY, this.radius);
  }
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
      if(x > current.minX && x < current.maxX && y < current.maxY && y > current.minY){
          var canFall = true;
          var actualColumn = column;
          console.log(current);
          return current;
      }
    }
  }
}
