
var express = require('express');
var formidable = require('express-formidable');
var path = require('path');
var app = express();
var fs = require('fs');
var shortid = require('shortid');

app.use(express.static(path.join(__dirname, "/public")));
app.use(formidable());

var getToDos = app.get("/get-todos", function (req, res) {
    res.sendFile(__dirname + "/data/data.json");
})

app.post("/create-todo", (req, res) => {
    console.log(req.fields);
    var yourData = req.fields;
    var todoContent = yourData.newtodo;
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        var taskComplete = false;
        var uniqueId = shortid.generate();
        var newToDo = { "id": uniqueId, "name": todoContent, "complete": taskComplete };
        currentToDos.push(newToDo);
        currentToDos = JSON.stringify(currentToDos);
        //console.log(updatedBlogPosts);
        fs.writeFile(__dirname + '/data/data.json', currentToDos, function (error) {
            console.log("written to data.json!");
            res.send(newToDo);
        });
    });
});

app.patch("/checkbox-changed", (req, res) => {
    var taskToUpdate = req.fields;
    var taskName = taskToUpdate.name;
    var completeStatus = taskToUpdate.complete;
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        for (var i = 0; i < currentToDos.length; i++) {
            //console.log("for loop");
            if (currentToDos[i].name == taskName) {
                //console.log("we have a match!");
                currentToDos[i].complete = completeStatus;
            }
        }
        currentToDos = JSON.stringify(currentToDos);
        fs.writeFile(__dirname + "/data/data.json", currentToDos, function (err) {
            console.log("writing changes");
            if (err) return console.log(err);
            res.send("success"); //this doesn't actually do anything important, but a res needs to be sent.
        });
    });
});

app.patch("/edit-todo", (req, res) => {
    console.log("put method gets to server");
    var givenId = req.fields.id;
    console.log("id: " + givenId);
    var newTaskName = req.fields.newTask;
    console.log("new task: " + newTaskName);
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        for (var i = 0; i < currentToDos.length; i++) {
            if (currentToDos[i].id == givenId) {
                console.log("we have a match!");
                console.log("task: " + currentToDos[i].name);
                currentToDos[i]["name"] = newTaskName;
            }
        }
        currentToDos = JSON.stringify(currentToDos);
        fs.writeFile(__dirname + "/data/data.json", currentToDos, function (err) {
            console.log("writing changes");
            if (err) return console.log(err);
            res.end();
        });
    });

});

app.delete("/delete-todo/:id", (req, res) => {
    var givenId = req.params.id;
    fs.readFile(__dirname + '/data/data.json', function (error, file) {
        var currentToDos = JSON.parse(file);
        var toDoArray = [];
        for (var i = 0; i < currentToDos.length; i++) {
            //console.log("for loop");
            if (currentToDos[i].id != givenId) {
                console.log("does not match given id");
                toDoArray.push(currentToDos[i]);
                console.log("added item to array");
            }
        }
        newToDos = JSON.stringify(toDoArray);
        fs.writeFile(__dirname + "/data/data.json", newToDos, function (err){
            console.log("writing changes");
            if (err) return console.log(err);
            res.send(newToDos);
        });
    });
});

app.listen(3000, function () {
    console.log("Server is now running. Listening on port 3000.");

});
