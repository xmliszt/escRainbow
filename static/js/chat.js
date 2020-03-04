$(document).ready(function(){
    var dateTime = getDateTime();
    var responseBubble = $(`
    <div>
        <span class="msg_head">Mr. Bot</span>
        <div>
            <div class="msg_cotainer">  
                <span class="msg_body"> Hi! How can I help you? </span><br>
                <button class="btn btn-sm btn-primary">Click Me</button>
            </div>
        </div>
        <span class="msg_time">${dateTime}</span>
    </div>`);
    $('#conversation_body').append(responseBubble);
    $('form').submit(function(e){
        e.preventDefault();
        // append chat message bubble
        var dateTime = getDateTime();
        var message = $('#userInputMsg').val();
        var fName = document.getElementById("fName").innerHTML;
        var lName = document.getElementById("lName").innerHTML;
        var bubble = $(`
        <div style="text-align: right">
            <span class="msg_head_send">${fName} ${lName}</span>
            <div>
                <div class="msg_cotainer_send">  
                    <span class="msg_body">$${message}</span><br>
                </div>
            </div>
            <span class="msg_time_send">${dateTime}</span>
        </div>`);
        $('#conversation_body').append(bubble);
        document.getElementById("userInputMsg").value = "";

        // send message to backend to be sent to rainbow service and get a response message back
        $.ajax({
            type: "POST",
            url: window.location.href,
            data: {message: message},
            success: function(data, status, els){
                console.log(`${status}: Receive response: ${data.response}`);
                var responseMsg = data.response.toString();
                var responseBody = data.from;
                console.log(`${responseMsg} ${responseBody}`);
                setTimeout(function(){
                    var dateTime = getDateTime();
                    var responseBubble = $(`
                    <div>
                        <span class="msg_head">${responseBody==0 ? "Mr. Bot" : "Agent "+responseBody}</span>
                        <div>
                            <div class="msg_cotainer">  
                                <span class="msg_body">${responseMsg}</span><br>
                            </div>
                        </div>
                        <span class="msg_time">${dateTime}</span>
                    </div>`);
                    $('#conversation_body').append(responseBubble);
                }, 1000);
            }
        });
    });

    $('#quit').click(function(){
        var decision = confirm("You are in Guest mode. Exit will erase all dialogue history.")
        if(decision){
            $.ajax({
                type: "GET",
                url: `/delete`,
                success: function(data, status, e){
                    console.log(`${status}: ${data.id} has been deleted successfully!`);
                    window.location.href = "/";
                }
            });
        } else {
            return false;
        }
    });
});

function getDateTime(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}