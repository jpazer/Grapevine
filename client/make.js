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
