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

    // $("#makeDomoSubmit").on("click", function(e) {
    //     e.preventDefault();
    //
    //     $("#domoMessage").animate({width:'hide'},350);
    //
    //     if($("#domoName").val() == '' || $("#domoAge").val() == '') {
    //         handleError("RAWR! All fields are required");
    //         return false;
    //     }
    //     console.log($("#domoForm").serialize());
    //     sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());
    //
    //     return false;
    // });
    //
    // $(".deleteButton").on("click", function (e) {
    //   e.preventDefault();
    //   sendAjax("/delete", {'name': $(this).attr('name'), '_csrf': $(this).val()});
    // });

    $(".makeButton").on("click", function (e) {
      e.preventDefault();
      sendAjax("/makePage", {'_csrf': $(this).val()});
    });
});
