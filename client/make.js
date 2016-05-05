"use strict";

$(document).ready(function() {


    function handleError(message) {
        $(".error").show();
        $(".error").text(message);
    }

    function sendAjax(action, data) {
      console.log("sending ajax " + action);
      console.dir(data);
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                $(".error").hide();
                window.location = result.redirect;
            },
            error: function(xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);
                handleError(messageObj.error);
            }
        });
    }

    $("#makeGameSubmit").on("click", function(e) {
        e.preventDefault();
        if($("#gameName").val() == '' || $("#gameMaxItr").val() == '' || $("#gameStartWords").val() == '') {
            handleError("All fields are required");
            return false;
        }
        sendAjax($("#gameForm").attr("action"), $("#gameForm").serialize());
        return false;
    });

    $(".deleteButton").on("click", function (e) {
      e.preventDefault();
      sendAjax("/delete", {'name': $(this).attr('name'), '_csrf': $(this).val()});
    });

    $(".game").on("click", function (e) {
      e.preventDefault();
      window.location = "/game/"+$(this).attr('name');
    });


});


var canvas;
var ctx;
var mouse = {};
var pmouse = {};
var canvasPos;

var draw = false;

function getOffsetRect(elem) {

    var box = elem.getBoundingClientRect()

    var body = document.body
    var docElem = document.documentElement


    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft


    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0


    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft

    return { top: Math.round(top), left: Math.round(left) }
}


function getMouse(e) {
  pmouse.x = mouse.x;
  pmouse.y = mouse.y;
  mouse.x = parseInt(e.clientX - canvasPos.left);
  mouse.y = parseInt(e.clientY - canvasPos.top);
  console.log(canvasPos.top);
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
  canvasPos = getOffsetRect(canvas);

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
