var cloneCount = 0;
var hasOpened = false;
var message;

$(document).ready(function() {
  
  initialize();

  if(performance.navigation.type == performance.navigation.TYPE_RELOAD){
    console.info("Page reloaded!");
    if (agentInfo){
      $.ajax({
        url: '/disconnect',
        type: 'POST',
        data: {agentID: agentInfo.id},
        success: function(data, status, els){
            console.log(`Agent [${data.id}] freed successfully!`);
        },
        error: function(err){
            console.error(err.responseText);
        }
      });
    }
  }

  $(".chat").hide();

  $(".chat-img").click(function() {
    if (!hasOpened){
      generateBotChoicesBubble();
      hasOpened = true;
    }
    $(".chat").show();
    $(".chat").animate({ opacity: "1.0", bottom: "20px" }, "slow");
    $(".toggle-chat-btn").animate({ opacity: "0.0" }, "slow");
    $(".toggle-chat-btn").hide();
  });

  $("form").submit(function(e) {
    e.preventDefault();
    // append chat message bubble
    message = $("#userInputMsg").val();
    generateSendBubble(message);
    if (mConversation){
      rainbowSDK.im.sendMessageToConversation(mConversation, message);
    }
    document.getElementById("userInputMsg").value = "";

  });

  $("#close").click(function() {
    $(".chat").animate({ opacity: "0.0", bottom: "0" }, "slow");
    $(".chat").hide();
    $(".toggle-chat-btn").show();
    $(".toggle-chat-btn").animate({ opacity: "1.0" }, "slow");
  });
  $("#quit").click(function() {
    var decision = confirm(
      "You are in Guest mode. Exit will erase all dialogue history."
    );
    if (decision) {
      createAjax("GET", "/delete", {}, function(data, status, els) {
        console.log(`${status}: ${data.id} has been deleted successfully!`);
        window.location.href = "/";
      });
    } else {
      return false;
    }
  });

  $("#registerBtn").click(function() {
    var username = $("#usernameInput").val();
    $.ajax({
      url: "/register",
      data: {
        username: username,
        password: "whatever",
        firstName: "David",
        lastName: "Lee"
      },
      type: "POST",
      success: function(data, status, r) {
        console.log(status);
      }
    });
  });
});
