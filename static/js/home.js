var cloneCount = 0;
var hasOpened = false;
var message;

$(document).ready(function () {

    initialize();

    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        console.info("Page reloaded!");
        if (agentInfo) {
            $.ajax({
                url: '/disconnect',
                type: 'POST',
                data: {
                    agentID: agentInfo.id
                },
                success: function (data, status, els) {
                    console.log(`Agent [${
                        data.id
                    }] freed successfully!`);
                },
                error: function (err) {
                    console.error(err.responseText);
                }
            });
        }
    }

    // login bank account
    $("#submit_btn").click(function () {
        var usernameInput = $("#usernameInput").val();
        var passwordInput = $("#passwordInput").val();
        if (username != '' && password != '') {
            $.ajax({
                url: '/login',
                type: 'POST',
                data: {
                    username: usernameInput,
                    password: passwordInput
                },
                success: function (data, status, r) {
                    console.log(`First Name: ${
                        data.firstName
                    } Last Name: ${
                        data.lastName
                    }`);
                },
                error: function (err) {
                    console.log('User not found');
                }
            })
        } else {
            return false;
        }
    });

    // bank account registration
    $("#register_btn").click(function () {
        var usernameInput = $("#usernameInput").val();
        var passwordInput = $("#passwordInput").val();
        var firstNameInput = $("#firstNameInput").val();
        var lastNameInput = $("#lastNameInput").val();
        $.ajax({
            url: "/register",
            type: "POST",
            data: {
                username = usernameInput,
                password = passwordInput,
                firstName = firstNameInput,
                lastName = lastNameInput
            },
            success: function (data, status, r) {
                console.log(status)
            },
            error: function (err) {
                console.log("Registration failed!" + err.responseText);
            }
        });
    });

    // logout bank account
    $("#logout-btn").click(function () {
        $.ajax({
            url: "/logout",
            type: "GET",
            success: function (data, status, r) {
                console.log(status);
            },
            error: function (err) {
                console.log("Failed to logout!" + err.responseText);
            }
        });
    });

    $(".chat").hide();

    $(".chat-img").click(function () {
        if (! hasOpened) {
            generateBotChoicesBubble();
            hasOpened = true;
        }
        $(".chat").show();
        $(".chat").animate({
            opacity: "1.0",
            bottom: "20px"
        }, "slow");
        $(".toggle-chat-btn").animate({
            opacity: "0.0"
        }, "slow");
        $(".toggle-chat-btn").hide();
    });

    $("form").submit(function (e) {
        e.preventDefault();
        // append chat message bubble
        message = $("#userInputMsg").val();
        generateSendBubble(message);
        if (mConversation) {
            rainbowSDK.im.sendMessageToConversation(mConversation, message);
        }
        document.getElementById("userInputMsg").value = "";

    });

    $("#close").click(function () {
        $(".chat").animate({
            opacity: "0.0",
            bottom: "0"
        }, "slow");
        $(".chat").hide();
        $(".toggle-chat-btn").show();
        $(".toggle-chat-btn").animate({
            opacity: "1.0"
        }, "slow");
    });
    $("#quit").click(function () {
        var decision = confirm("You are in Guest mode. Exit will erase all dialogue history.");
        if (decision) {
            createAjax("GET", "/delete", {}, function (data, status, els) {
                console.log(`${status}: ${
                    data.id
                } has been deleted successfully!`);
                window.location.href = "/";
            });
        } else {
            return false;
        }
    });

});
