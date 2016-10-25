/*client.js
 *
 *author: jasmine pazer
 *description: handles sending ajax requests for login and sign up
 */

"use strict";

$(document).ready(function() {

    function handleError(message) {
      $(".error").show();
      $(".error").text(message);
    }

    function sendAjax(action, data) {
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
    
    //send a request to make a new account
    //submit signup form information with error checking
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All fields are required");
            return false;
        }
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("Passwords do not match");
            return false;
        }
        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        return false;
    });
    
    //send a request to login with existing account
    //submit login form information with error checking
    $("#loginSubmit").on("click", function(e) { 
        e.preventDefault();
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("Username or password is empty");
            return false;
        }
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());
        return false;
    });
});
