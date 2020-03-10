var cloneCount = 0;

$(document).ready(function(){

    generateBotChoicesBubble();
    $('.chat').hide();

    $('.chat-img').click(function(){
        $('.chat').show();
        $('.chat').animate({opacity: '1.0', bottom: '20px'}, 'slow');
        $('.toggle-chat-btn').animate({opacity: '0.0'}, 'slow');
        $('.toggle-chat-btn').hide();
    });

    $('form').submit(function(e){
        e.preventDefault();
        // append chat message bubble
        var message = $('#userInputMsg').val();
        generateSendBubble(message);
        document.getElementById("userInputMsg").value = "";
        botTextResponse(message);
        
    });

    $('#close').click(function(){
        $('.chat').animate({opacity: '0.0', bottom: '0'}, 'slow');
        $('.chat').hide();
        $('.toggle-chat-btn').show();
        $('.toggle-chat-btn').animate({opacity: '1.0'}, 'slow');
    });

    $('#quit').click(function(){
        var decision = confirm("You are in Guest mode. Exit will erase all dialogue history.")
        if(decision){
            createAjax("GET", '/delete', {}, function(data, status, els){
                console.log(`${status}: ${data.id} has been deleted successfully!`);
                window.location.href = "/";
            });
        } else {
            return false;
        }
    });
});

