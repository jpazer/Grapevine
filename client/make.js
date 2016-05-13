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

    $("#addCardSubmitText").on("click", function(e) {
        e.preventDefault();
        if($("#newCard").val() == '') {
            handleError("You must describe the picture");
            return false;
        }
        sendAjax("/addcard/"+encodeURI($(this).attr('name')), {'newCard': $("#newCard").val(), 'cardType':"string", '_csrf': $(this).val()});
        return false;
    });

    $("#addCardSubmitImg").on("click", function(e) {
        e.preventDefault();
      
        var newCard = document.querySelector("#canvas").toDataURL("image/png");

        sendAjax("/addcard/"+encodeURI($(this).attr('name')), {'newCard': newCard, 'cardType':"img", '_csrf': $(this).val()});
        return false;
    });

    $(".deleteButton").on("click", function (e) {
      e.preventDefault();
      sendAjax("/delete", {'name': $(this).attr('name'), '_csrf': $(this).val()});
    });

    $(".game").on("click", function (e) {
      e.preventDefault();
      window.location = "/game/"+encodeURI($(this).attr('name'));
    });
});



