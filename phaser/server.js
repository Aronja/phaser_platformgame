const path = require("path");

var express = require("express");

var app = express();
var port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "/assets")));
// var fullPath = path.join(__dirname, "foo.js");

app.get("/", function(req, res) {
  res.sendfile("./assets/game.html");
});

app.listen(port);
console.log("Server launched on port:", port);
