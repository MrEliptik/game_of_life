var rows = 9;
var cols = 9;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var size = canvasWidth / rows;
var canvasHeight = canvas.height;
var canvasWidth = canvas.width;

// Creation of the grid
// 2D array initialized with -1
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


drawGrid();