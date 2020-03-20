var cloneCount = 0;
var hasOpened = false;
var message;

$(document).ready(function() {

  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
  
  const button = $('#emoji-button');
  const chat_box = document.querySelector('.emoji-block');
  const picker = new EmojiButton({
    rootElement: chat_box,
    theme: "dark",
    zIndex: 999,
    position: "auto",
    showSearch: false,
    showPreview: false,
    autoHide: false
  });

  picker.on('emoji', emoji => {
    document.querySelector('#userInputMsg').value += emoji;
  });
  button.click(function(){
    picker.togglePicker(button);
  });
  
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });


  // initialize rainbow SD
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

  // bank account registration
  $("#register_btn").click(function (){
    var usernameInput = $("#usernameInput").val();
    var passwordInput = $("#passwordInput").val();
    var firstNameInput = $("#firstNameInput").val();
    var lastNameInput = $("#lastNameInput").val();
    $.ajax({
        url: "/register",
        type: "POST",
        data: {
            username: usernameInput,
            password: passwordInput,
            firstName: firstNameInput,
            lastName: lastNameInput
        },
        success: function (data, status, r) {
            console.log(status);
        },
        error: function (err) {
            console.log("Registration failed!" + err.responseText);
          }
      });
  });

  // bank account signin ajax
  $("#login_btn").click(function () {
    var usernameInput = $("#usernameInput").val();
    var passwordInput = $("#passwordInput").val();
    if (usernameInput != '' && passwordInput != '') {
        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                username: usernameInput,
                password: passwordInput
            },
            crossDomain: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                }, // request for browser to pass back cookie
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

  $("#sendBtn").click(function() {
    // append chat message bubble
    message = $("#userInputMsg").val();
    generateSendBubble(message);
    if (mConversation){
      rainbowSDK.im.sendMessageToConversation(mConversation, message);
      stopTimeOutEvent();
      startTimeOutForReminder(3);
    } else {
      botTextResponse(message);
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
