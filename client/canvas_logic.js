/*canvas_logic.js
 *
 *author: jasmine pazer
 *description: handles drawing on a canvas
 */


///////VARIABLES////////

var canvas;
var ctx;
var mouse = {};
var pmouse = {};
var canvasPos;
var draw = false;

///////FUNCTIONS////////

function getMouse(e) {
  //get the mouse position on the canvas
  canvasPos = canvas.getBoundingClientRect();
    
  //update mouse variables
  pmouse.x = mouse.x;
  pmouse.y = mouse.y;
  mouse.x = parseInt(e.clientX - canvasPos.left);
  mouse.y = parseInt(e.clientY - canvasPos.top);
    
  //draw from the previous mouse position
  if (draw){
    ctx.beginPath();
        ctx.moveTo(pmouse.x, pmouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
  }
}

function init() {
  //initilize variables
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
    
  //set canvas and line style
  ctx.lineCap = "round";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  
  //mouse events
  document.onmousemove = getMouse;
  document.onmousedown = function () {
    draw = true;
  };
  document.onmouseup = function () {
    draw = false;
  };
}

window.onload = init;