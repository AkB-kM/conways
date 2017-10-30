var canvas = document.querySelector('canvas');
var gridPos = {
  x: undefined,
  y: undefined
};

var mousePos = {
  x: undefined,
  y: undefined
};

var click = {
  state: false,
  action: false,
  gridstartx: undefined,
  gridstarty: undefined,
  gridendx: undefined,
  gridendy: undefined,
  startx: undefined,
  starty: undefined,
  endx: undefined,
  endy: undefined
};

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;
canvas.onmousemove = function(event) {
  gridPos.x = Math.floor((event.x - menuOffset) / blocksize);
  gridPos.y = Math.floor(event.y / blocksize);
  mousePos.x = event.x;
  mousePos.y = event.y;
};

canvas.onmousedown = function(event) {
  click.state = true;
  click.action = false;
  click.gridstartx = Math.floor((event.x - menuOffset) / blocksize);
  click.gridstarty = Math.floor(event.y / blocksize);
  click.startx = event.x;
  click.starty = event.y;
};
canvas.onmouseup = function(event) {
  click.state = false;
  click.gridendx = Math.floor((event.x - menuOffset) / blocksize);
  click.gridendy = Math.floor(event.y / blocksize);
  click.endx = event.x;
  click.endy = event.y;
  if ( click.gridendy - click.gridstarty == 0
    && click.gridendx - click.gridstartx == 0) {
      click.action = true;
    }

    if(click.endx >= 20 && click.endx <= 150
      && click.endy >= 20 && click.endy <= 100
      && click.startx >= 20 && click.startx <= 150
      && click.starty >= 20 && click.starty <= 100
    ) {
      click.action = false;
      gameState = !gameState;
    }
    console.log(gameState);
  };



  // Initialize variables
  var maxWidth = window.screen.availWidth;
  var maxHeight = window.screen.availHeight;
  var c = canvas.getContext('2d');
  var blocksize = 15;
  var gameState = false;
  var menuOffset = 170;
  var notAlive = '#ABB7D4';
  var hover_notAlive = '#7FADA9'
  var alive = '#4285A8';


  // Cell object
  function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.nextalive = false;

    /* Draw function */
    this.draw = function() {
      //c.fillStyle = colorArray[Math.floor(Math.random() * colorArray.length)]

      //Cell appearance while mouse hovering

      if(gridPos.x*blocksize == this.x - menuOffset && gridPos.y*blocksize == this.y){

        /*Flip alive status when clicked*/
        if(click.action){
          click.action = false;
          this.alive = !this.alive;
        }

        if(!click.state){
          this.cellgap = 0;
        }
        else{
          this.cellgap = 1;
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
        this.cellgap = 1;
        if(this.alive){
          c.fillStyle = alive;
        }
        else{
          c.fillStyle = notAlive;
        }
      }

      // Cell appearance that is clicked but not yet selected
      if(click.gridstartx*blocksize == this.x - menuOffset && click.gridstarty*blocksize == this.y){
        if(click.state){
          this.cellgap = 4;
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
          this.grid[x][y] = new Cell(x*blocksize+menuOffset, y*blocksize);
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
      // Draw menu
      c.fillStyle = '#1C1D21';
      c.fillRect(10, 10, 152, canvas.height-20);

      // Pick color for start button (based on game state)
      if(gameState) {
        c.fillStyle = '#92CDCF';
      }
      else {
        c.fillStyle = '#445878';
        c.font = 'bold 30pt Calibri';
      }
      // Draw and animate buttons
      if(mousePos.x >= 20 && mousePos.x <= 150
        && mousePos.y >= 20 && mousePos.y <= 100) {
          // Animate for mouse hovering
          c.fillRect(15, 15, 140, 90);
          c.fillStyle = '#FFFFFF';
          c.fillText('Start', 25, 70);
        }
        else {
          c.fillRect(20, 20, 130, 80);
          c.fillStyle = '#FFFFFF';
          c.fillText('Start', 25, 70);
        }
      }

      /* Update next Iteration of board */
      this.update = function() {
        var current_cell;
        var cellNeighbors;
        for (var x = 0; x < this.width; x++) {
          for(var y = 0; y < this.height; y++) {
            current_cell = this.grid[x][y];
            cellNeighbors = this.getNeighbor(x,y);

            // determine cell alive status
            if(gameState){

              if(current_cell.alive && cellNeighbors < 2) {
                current_cell.nextalive = false;
              }
              else if(current_cell.alive
                && (cellNeighbors == 2 || cellNeighbors == 3)) {
                  current_cell.nextalive = true;
                }
                else if(current_cell.alive && cellNeighbors >= 4) {
                  current_cell.nextalive = false;
                }
                else if(!current_cell.alive
                  && (cellNeighbors == 3)) {
                    current_cell.nextalive = alive;
                  }
            }
            else{
              current_cell.nextalive = current_cell.alive;
            }
          }
        }

        // update cell life status
        for (var x = 0; x < this.width; x++) {
          for(var y = 0; y < this.height; y++) {
            this.grid[x][y].alive = this.grid[x][y].nextalive;
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
      if (currentTime - lastupdate > 250){
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
