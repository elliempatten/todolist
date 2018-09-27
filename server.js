var express = require('express');
var formidable = require('express-formidable');
var path = require('path');
var app = express();
var fs = require('fs');
var shortid = require('shortid');

app.use(express.static(path.join(__dirname, "/public")));
app.use(formidable());

var getToDos = app.get("/todo", function (req, res) {
    res.sendFile(__dirname + "/data/data.json");
})

app.post("/todo", (req, res) => {
    console.log("fields: " + req.fields);
    var yourData = req.fields;
    var name = yourData.name;
    var complete = yourData.complete;
    console.log("id:" + yourData.id + " name: " + name + "complete: " + complete);
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        var uniqueId = shortid.generate();
        var newToDo = { "id": uniqueId, "name": name, "complete": complete };
        currentToDos.push(newToDo);
        currentToDos = JSON.stringify(currentToDos);
        fs.writeFile(__dirname + '/data/data.json', currentToDos, function (error) {
            console.log("written to data.json!");
            res.send(newToDo);
        });
    });
});


app.put("/todo/:id", (req, res) => {
    var id = req.params.id; //fields also works
    var name = req.fields.newTask;
    var complete = req.fields.complete;
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        for (var i = 0; i < currentToDos.length; i++) {
            if (currentToDos[i].id == id) {
                currentToDos[i]["name"] = name;
                currentToDos[i]["complete"] = complete;
            }
        }
        currentToDos = JSON.stringify(currentToDos);
        fs.writeFile(__dirname + "/data/data.json", currentToDos, function (err) {
            if (err) return console.log(err);
            res.end();
        });
    });

});

app.delete("/todo/:id", (req, res) => {
    console.log("reaches delete method");
    var givenId = req.params.id;
    var newToDos = [];
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        for (var i = 0; i < currentToDos.length; i++) {
            if (currentToDos[i].id != givenId) {
                newToDos.push(currentToDos[i]);
            }
        }
        newToDos = JSON.stringify(newToDos);
        console.log("array to add: " + newToDos);
        fs.writeFile(__dirname + "/data/data.json", newToDos, function (err) {
            console.log("array to add while in the writeFile:" + newToDos);
            if (err) return console.log(err);
            //res.send(newToDos);
            res.end();

        });
    });
});




app.listen(3000, function () {
    console.log("Server is now running. Listening on port 3000.");

});
