const TIMEOUT = 1;
const LIVE_P_MAX = 0.5;
const LIVE_P_MIN = 0.01;

var rows = 20;
var cols = 20;

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

// Current random color
var currColor = ctx.fillStyle = rainbow(256, Math.floor(Math.random() * 256));

canvas.addEventListener("click", handleEnd, false);

start();

function handleEnd() {
    start();
}

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

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
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
    ctx.fillStyle = "#242424";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //drawGrid();
    ctx.fillStyle = currColor
    drawContent(grid);
    setTimeout(loop, TIMEOUT);
}

function start() {
    randomSeed();
    currColor = ctx.fillStyle = rainbow(256, Math.floor(Math.random() * 256));
    loop();
}
