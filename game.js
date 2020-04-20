const TIMEOUT = 100;
const LIVE_P_MAX = 0.5;
const LIVE_P_MIN = 0.05;

var rows = 50;
var cols = 50;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasHeight = canvas.height;
var canvasWidth = canvas.width;
var cellW = canvasWidth / cols;
var cellH = canvasHeight / rows;

// Creation of the grid
// 2D array initialized with 0
var grid = Array.from(Array(rows), _ =>
    Array(cols).fill(0)
);

function drawGrid(color="#cccccc") {
    ctx.beginPath();

    for (var i = 0; i <= rows; i++) {
        ctx.moveTo(0, (canvasHeight / rows) * i);
        ctx.lineTo(canvasWidth, (canvasHeight / rows) * i);
    }

    for (var i = 0; i <= cols; i++) {
        ctx.moveTo((canvasWidth / cols) * i, 0);
        ctx.lineTo((canvasWidth / cols) * i, canvasHeight);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
}


function drawContent(content){
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (content[i][j] == 1) {
                ctx.fillRect(cellW*j, cellH*i, cellW, cellH);
            }
        }
    }
}

function randomSeed(){
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var p = Math.random() * (LIVE_P_MAX - LIVE_P_MIN) + LIVE_P_MIN;
            if(Math.random() < p) grid[i][j] = 1;
            else grid[i][j] = 0;
        }
    }
}

function getCell(matrix, y, x) {
    var NO_VALUE = null;
    var value, hasValue;

    try {
        hasValue = matrix[y][x] !== undefined;
        value    = hasValue?  matrix[y][x] : NO_VALUE;
    } catch(e) {
        value    = NO_VALUE;
    }
    return value;
}

// Returns an array: 
//[left, topleft, top, topright, right, bottomright, bottom, bottomleft]
function getNeighbors(i, j){
    return [
        getCell(grid, i, j-1), getCell(grid, i-1, j-1), 
        getCell(grid, i-1, j), getCell(grid, i-1, j+1), 
        getCell(grid, i, j+1), getCell(grid, i+1, j+1),
        getCell(grid, i+1, j), getCell(grid, i+1, j-1)
    ];
}

function getLivingNeighbors(neighbors){
    living = 0
    for (const neighbor of neighbors){
        if (neighbor == 1) living++;
    }
    return living;
}

function update() {
    // tmp array where all cells are dead
    var tmp = Array.from(Array(rows), _ =>
        Array(cols).fill(0)
    );

    // Apply Conway's game of life rules
    // see: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var neighbors = getNeighbors(i, j);
            var livingNeighbors = getLivingNeighbors(neighbors);

            // Any live cell with two or three live neighbors survives.
            if ((livingNeighbors == 2 || livingNeighbors == 3) && grid[i][j] == 1){
                tmp[i][j] = 1;
            }

            // Any dead cell with three live neighbors becomes a live cell.
            if(livingNeighbors == 3 && grid[i][j] == 0) tmp[i][j] = 1;

            // All other cells are dead (tmp is initialized at 0)
        }
    }
    
    // Put the result back into the grid
    grid = tmp.slice();
}

function loop(){
    console.log('tick');
    update();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGrid();
    drawContent(grid);
    setTimeout(loop, TIMEOUT);
}

// Random number of cell alive
var cellsAlive = Math.floor(Math.random() * ((rows*cols) - 1) + 1);

randomSeed()

loop();