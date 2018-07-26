var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, "/public")));

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, "/public/todolist.html"));

});




app.listen(3000, function(){
    console.log("Server is now running. Listening on port 3000.");

});
