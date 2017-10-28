var canvas = document.querySelector('canvas');


canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

var maxWidth = window.screen.availWidth;
var maxHeight = window.screen.availHeight;

var mouse = {
  x: undefined,
  y: undefined
};


//Listeners
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth - 2;
  canvas.height = window.innerHeight - 2;

});

window.addEventListener('mousemove', 
  function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    console.log(mouse);
});


// Initialize variables
var c = canvas.getContext('2d');
var cellgap = 2;
var blocksize = 40;
var cellsize = blocksize - 2*cellgap;

var colorArray = [
  '#169185'
]

var notAlive = '#169185';
var alive = '#F3F5F1';


// Cell object
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.alive = false;
  this.draw = function() {
    //c.fillStyle = colorArray[Math.floor(Math.random() * colorArray.length)]
    if(this.alive){
      c.fillStyle = alive;
    }
    else{
      c.fillStyle = notAlive;
    }    
    c.fillRect(x+2*cellgap, y+2*cellgap, cellsize, cellsize);
  }
}

// Grid
function Grid(width, height) {
  this.width = Math.floor(width / cellsize);
  this.height = Math.floor(height / cellsize);
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

  this.update = function() {
    var currrent_cell;
    for (var x = 0; x < this.width; x++) {
      for(var y = 0; y < this.height; y++) {
        currrent_cell = this.grid[x][y];

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
console.log(board.getNeighbor(0,1));

function animate(){

  setTimeout(
    function (){
      requestAnimationFrame(animate)
      c.clearRect(0,0,innerWidth,innerHeight);
      board.draw();
    }, 250);  
}

animate();

