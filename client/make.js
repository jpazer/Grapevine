"use strict";

$(document).ready(function() {

    function handleError(message) {
        console.log(message);
    }

    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                console.log("posteed");
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
            handleError("RAWR! All fields are required");
            return false;
        }
        console.dir($("#gameForm"));
        sendAjax($("#gameForm").attr("action"), $("#gameForm").serialize());

        return false;
    });

    $(".deleteButton").on("click", function (e) {
      e.preventDefault();
      sendAjax("/delete", {'name': $(this).attr('name'), '_csrf': $(this).val()});
    });
});
