$(document).ready(function() {
    let socket = io();

    socket.on("CONNECTION", function(data) {
        $("span.userCount").html(data.clients);
    });

    socket.on("DISCONNECTION", function(data) {
        $("span.userCount").html(data.clients);
    });

    socket.on("GLOBAL_TYPING_EVENT_OCCURED", function(data) {
        if(data.from != socket.id) {
            $(".liveEditor").val(data.text);
        }

        $("div.result").html(data.text);
    })

    $(document).keyup(function(e) {
        if($(".liveEditor").is(":focus")) {
            socket.emit("DID_TYPING_OCCUR", {
                keyCode: e.keyCode,
                text: $(".liveEditor").val()
            })
        }
    });
});