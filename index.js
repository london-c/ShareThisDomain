// Express Stuff
let express = require("express");
let app = express();

let fs = require("fs");

let path = require("path");

let ngrok = require("ngrok");
ngrok.connect(3000, function (err, url) {
    if(!err) {
        console.log(url)
    } else {
        console.log(err);
    }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

let textBoxContent = ``;

// Home Page
app.get("/", (req, res) => {
    // Send index.html
    res.render("index", {
        text: textBoxContent
    });
});

// Socket IO Stuff
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var clientCount = 0;

io.on("connection", function(socket) {
    console.log("A User Connected" + clientCount);

    clientCount++;

    io.emit("CONNECTION", { clients: clientCount })

    socket.on("disconnect", function(data) {
        console.log("A User Disconnected: " + clientCount);
        clientCount--;
        io.emit("DISCONNECTION", { clients: clientCount })
    })

    // io.emit("GLOBAL_TYPING_EVENT_OCCURED", { text: textBoxContent });

    socket.on("DID_TYPING_OCCUR", function(data) {
        console.log(data)

        var text = data.text;

        text = text.replaceAll("<script>", "&gt;script&lt;");
        text = text.replaceAll("</script>", "&gt;/script&lt;");

        textBoxContent = data.text;

        io.emit("GLOBAL_TYPING_EVENT_OCCURED", { text: data.text, from: socket.id });
    });
});

server.listen(3000, function() {
    console.log("Listening on :3000");
});