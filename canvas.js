var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

// Initialize variables
var c = canvas.getContext('2d');

var cellgap = 2;
var cellsize = 50 - 2*cellgap;

var colorArray = [
  '#169185'
]

// Cell object
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.alive = false;
  this.draw = function() {
    c.fillStyle = colorArray[Math.floor(Math.random() * colorArray.length)]
    c.fillRect(x+2*cellgap, y+2*cellgap, cellsize, cellsize);
  }
}

// Grid
function Grid(width, height) {
  this.width = Math.floor(width / cellsize);
  this.height = Math.floor(height / cellsize);
  this.grid = new Array(this.width * this.height)
  this.draw = function() {

    //Draw grid
    for (var x = 0; x < this.width; x++) {
      for(var y = 0; y < this.height; y++) {

        //WOWEFASDFASDF
        //SDFASDF
        this.grid[y * this.width + x] = new Cell(x*50, y*50);
        this.grid[y * this.width + x].draw();

        //c.shadowColor = '#999';
        //c.shadowBlur = 20;
        //c.shadowOffsetX = 3;
        //c.shadowOffsetY = 3;
      }
    }
  }
}

var board = new Grid(canvas.width, canvas.height);
board.draw();

//
// Window Resizing Event Listener
window.addEventListener('resize', function() {
  canvas.width = window.innerWidth - 2;
  canvas.height = window.innerHeight - 2;
  var gridx = Math.floor(canvas.width / cellsize);
  var gridy = Math.floor(canvas.height / cellsize);
});

var x = 200;
function animate() {
  requestAnimationFrame(animate);


}

animate();
