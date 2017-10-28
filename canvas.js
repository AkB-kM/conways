var canvas = document.querySelector('canvas');
var gridPos = {
  x: undefined,
  y: undefined
};


var clickAction = {
  state: false,
  action: false,
  startx: undefined,
  starty: undefined,
  endx: undefined,
  endy: undefined
};

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;
canvas.onmousemove = function(event) {
    gridPos.x = Math.floor(event.x / blocksize);
    gridPos.y = Math.floor(event.y / blocksize);
};

canvas.onmousedown = function(event) {
  clickAction.state = true;
  clickAction.action = false;
  clickAction.startx = gridPos.x;
  clickAction.starty = gridPos.x;
};
canvas.onmouseup = function(event) {
  clickAction.state = false;
  clickAction.endx = gridPos.x;
  clickAction.endy = gridPos.x;
  if ( clickAction.endy - clickAction.starty == 0 && clickAction.endx - clickAction.startx == 0){
    clickAction.action = true;
  }
  console.log(clickAction);
};



// Initialize variables
var maxWidth = window.screen.availWidth;
var maxHeight = window.screen.availHeight;
var c = canvas.getContext('2d');
var blocksize = 40;
var notAlive = '#169185';
var hover_notAlive = '#9FB8A8'
var alive = '#F3F5F1';


// Cell object
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.alive = false;

  /* Draw function */
  this.draw = function() {
    //c.fillStyle = colorArray[Math.floor(Math.random() * colorArray.length)]

    //Cell appearance while mouse hovering
    if(gridPos.x*blocksize == this.x && gridPos.y*blocksize == this.y){

      /*Flip alive status when clicked*/
      if(clickAction.action){
        clickAction.action = false;
        this.alive = !this.alive;
      }
      
      if(clickAction.state){
        this.cellgap = 4;
      }
      else{
        this.cellgap = 0;
      }
      if(this.alive){
        c.fillStyle = alive;
      }
      else{
        c.fillStyle = notAlive;
      }
    }
    // Cell appearance while mouse not hovering
    else{
      this.cellgap = 2;
      if(this.alive){
        c.fillStyle = alive;
      }
      else{
        c.fillStyle = notAlive;
      }
    }

    //draw the cell
    this.cellsize = blocksize - 2*this.cellgap;
    c.fillRect(x+this.cellgap, y+this.cellgap, this.cellsize, this.cellsize);
  }
}

// Grid
function Grid(width, height) {
  this.width = Math.floor(width / blocksize);
  this.height = Math.floor(height / blocksize);
  this.grid = new Array(this.width);

  for(var x = 0; x < this.width; x++){
    this.grid[x] = new Array(this.height);
  }

  /* Setup board */
  this.setup = function() { 
    for (var x = 0; x < this.width; x++) {
      for(var y = 0; y < this.height; y++) {
        this.grid[x][y] = new Cell(x*blocksize, y*blocksize);
      }
    }
  }
  /* Draw the board */
  this.draw = function() {
    for (var x = 0; x < this.width; x++) {
      for(var y = 0; y < this.height; y++) {
        this.grid[x][y].draw();
      }
    }
  }

  /* Update next Iteration of board */
  this.update = function() {
    var currrent_cell;
    var cellNeighbors;
    for (var x = 0; x < this.width; x++) {
      for(var y = 0; y < this.height; y++) {
        currrent_cell = this.grid[x][y];
        cellNeighbors = this.getNeighbor(x,y);
      }
    }
  }

  /* Get Count of Neighbors alive */
  this.getNeighbor = function (x,y){
    var count = 0;
    if ( x - 1 >= 0){ // LEFT
      if(this.grid[x - 1][y].alive){
        count++;
      }
    }
    if ( x - 1 >= 0 && y - 1 >= 0){ // UPPER LEFT
      if(this.grid[x - 1][y - 1].alive){
        count++;
      }
    }
    if ( y - 1 >= 0){ // TOP
      if(this.grid[x][y - 1].alive){
        count++;
      }
    }
    if ( x + 1 < this.width && y - 1 >= 0){ // UPPER RIGHT
      if(this.grid[x + 1][y - 1].alive){
        count++;
      }
    }
    if ( x + 1 < this.width){ // RIGHT
      if(this.grid[x + 1][y].alive){
        count++;
      }
    }
    if ( x + 1 < this.width && y + 1 < this.height){ // LOWER RIGHT
      if(this.grid[x + 1][y + 1].alive){
        count++;
      }
    }
    if ( y + 1 < this.height){ //BOTTOM
      if(this.grid[x][y + 1].alive){
        count++;
      }
    }
    if ( x - 1 >= 0 && y + 1 < this.height){ // LOWER LEFT
      if(this.grid[x - 1][y + 1].alive){
        count++;
      }
    }
    return count;    
  }
}


var board = new Grid(maxWidth, maxHeight);
board.setup();
board.draw();
var lastupdate = Date.now();

function animate(){
  requestAnimationFrame(animate)
  c.clearRect(0,0,innerWidth,innerHeight);
  var currentTime = Date.now()
  //check if 250 MS passed, update board
  if ( currentTime - lastupdate > 250){
    board.update();
    lastupdate = currentTime;
  }
  board.draw();
  //console.log(board.getNeighbor(1,1));
}

animate();

//Listeners
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth - 2;
  canvas.height = window.innerHeight - 2;
  board.draw();
});



