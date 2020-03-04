$(document).ready(function(){
    $('form').submit(function(e){
        e.preventDefault();
        // append chat message bubble
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var message = $('#userInputMsg').val();
        var fName = document.getElementById("fName").innerHTML;
        var lName = document.getElementById("lName").innerHTML;
        var bubble = $(`
        <div class="d-flex justify-content-end mb-4">
            <div class="msg_cotainer_send">
                <span class="msg_head_send">${fName} ${lName}</span>
                ${message}
                <span class="msg_time_send">${dateTime}</span>
            </div>
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
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date+' '+time;
                    var responseBubble = $(`
                    <div class="d-flex justify-content-start mb-4">
                        <div class="msg_cotainer">
                            <span class="msg_head">
                            ${responseBody==0 ? "Bot" : "Agent "+responseBody}
                            </span>
                            ${responseMsg}
                            <span class="msg_time">${dateTime}</span>
                        </div>
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
