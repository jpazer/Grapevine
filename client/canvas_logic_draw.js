var canvas;
var ctx;
var mouse = {};
var pmouse = {};
var canvasPos;
var draw = false;

function getMouse(e) {
  canvasPos = canvas.getBoundingClientRect();
  pmouse.x = mouse.x;
  pmouse.y = mouse.y;
  mouse.x = parseInt(e.clientX - canvasPos.left);
  mouse.y = parseInt(e.clientY - canvasPos.top);
  if (draw){
    ctx.beginPath();
        ctx.moveTo(pmouse.x, pmouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
  }
}

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  document.onmousemove = getMouse;
  document.onmousedown = function () {
    draw = true;
  };
  document.onmouseup = function () {
    draw = false;
  };
}

window.onload = init;