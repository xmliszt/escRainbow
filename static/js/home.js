var cloneCount = 0;
var hasOpened = false;
var message;
var FN;
var LN;

$(document).ready(function() {
  $(".navbar a, footer a[href='#top']").on("click", function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top
        },
        900,
        function() {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });

  const button = $("#emoji-button");
  const chat_box = document.querySelector(".emoji-block");
  const picker = new EmojiButton({
    rootElement: chat_box,
    theme: "dark",
    zIndex: 999,
    position: "auto",
    showSearch: false,
    showPreview: false,
    autoHide: false
  });

  picker.on("emoji", emoji => {
    document.querySelector("#userInputMsg").value += emoji;
  });
  button.click(function() {
    picker.togglePicker(button);
  });

  $(window).scroll(function() {
    $(".slideanim").each(function() {
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass("slide");
      }
    });
  });

  // initialize rainbow SD
  initialize();

  initialize();

  if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    console.info("Page reloaded!");
    if (agentInfo) {
      $.ajax({
        url: "/disconnect",
        type: "POST",
        data: {
          agentID: agentInfo.id
        },
        success: function(data, status, els) {
          console.log(`Agent [${data.id}] freed successfully!`);
        },
        error: function(err) {
          console.error(err.responseText);
        }
      });
    }
    var myCookies = document.cookie;
    if (myCookies) {
      console.log(`cookie: ${myCookies}`);
    }
  }

  $(".chat").hide();

  $(".chat-img").click(function() {
    if (!hasOpened) {
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
    if (mConversation) {
      rainbowSDK.im.sendMessageToConversation(mConversation, message);
      stopTimeOutEvent();
      startTimeOutForReminder(3);
    } else {
      botTextResponse(message);
    }
    document.getElementById("userInputMsg").value = "";
  });

  $(".chat").hide();

  $(".chat-img").click(function() {
    if (!hasOpened) {
      generateBotChoicesBubble();
      hasOpened = true;
    }
    $(".chat").show();
    $(".chat").animate(
      {
        opacity: "1.0",
        bottom: "20px"
      },
      "slow"
    );
    $(".toggle-chat-btn").animate(
      {
        opacity: "0.0"
      },
      "slow"
    );
    $(".toggle-chat-btn").hide();
  });

  $("form").submit(function(e) {
    e.preventDefault();
    // append chat message bubble
    message = $("#userInputMsg").val();
    generateSendBubble(message);
    if (mConversation) {
      rainbowSDK.im.sendMessageToConversation(mConversation, message);
    }
    document.getElementById("userInputMsg").value = "";
  });

  $("#close").click(function() {
    $(".chat").animate(
      {
        opacity: "0.0",
        bottom: "0"
      },
      "slow"
    );
    $(".chat").hide();
    $(".toggle-chat-btn").show();
    $(".toggle-chat-btn").animate(
      {
        opacity: "1.0"
      },
      "slow"
    );
  });

  $("#quit").click(function() {
    var decision = confirm("Logout will erase all dialogue history.");
    if (decision) {
      createAjax("GET", "/logout", {}, function(data) {
        window.alert("You have been logged out successfully!");
        window.location.reload();
      });
    }
  });

  // bank account signin ajax
  $("#login_btn").click(function() {
    var usernameInput = $("#usernameInput").val();
    var passwordInput = $("#passwordInput").val();
    if (usernameInput != "" && passwordInput != "") {
      $.ajax({
        url: "/login",
        type: "POST",
        data: {
          username: usernameInput,
          password: passwordInput
        },
        crossDomain: true,
        dataType: "json",
        xhrFields: {
          withCredentials: true
        }, // request for browser to pass back cookie
        success: function(data, status, r) {
          if (data.loggedIn) {
            console.log(
              `First Name: ${data.firstName} Last Name: ${data.lastName}`
            );
            $("#titleText").html(`${data.firstName} ${data.lastName}`);
            $("#myForm").hide();
            window.alert("You are logged in successfully!");
            window.location.reload();
          } else {
            $("#alertLogin").show();
            $("#alertLogin").html("Incorrect password! Please try again!");
          }
        },
        error: function(err) {
          console.log("User not found");
          $("#alertLogin").show();
          $("#alertLogin").html(
            "You are not registered yet! Please register first!"
          );
          $("#signInRegisterBtn").show();
        }
      });
    }
  });

  $("#registerBtn").click(function() {
    var username = $("#emailSignup").val();
    var password = $("#pwdSignup").val();
    var pwdrepeat = $("#pwdRepeat").val();
    var firstName = $("#fnSignup").val();
    var lastName = $("#lnSignup").val();
    var alertMsg = $("#alertMsg");
    var modal = document.getElementById("id01");
    if (
      username != "" &&
      password != "" &&
      pwdrepeat != "" &&
      firstName != "" &&
      lastName != ""
    ) {
      if (password == pwdrepeat) {
        $.ajax({
          url: "/register",
          data: {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
          },
          type: "POST",
          success: function(data, status, r) {
            if (data.success == 1) {
              modal.style.display = "none";
              window.alert("You are registered successfully!");
            } else if (data.success == 2) {
              alertMsg.show();
              alertMsg.html("You are already registered! Please sign in!");
            }
          },
          error: function(error) {
            if (error.status == 500) {
              alertMsg.show();
              alertMsg.html(
                "Failed to register! Please contact the backend support team or try again!"
              );
            }
          }
        });
      } else {
        alertMsg.show();
        alertMsg.html("Password does not match!");
      }
    }
  });
});
