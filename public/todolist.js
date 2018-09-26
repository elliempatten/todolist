
var addTaskButton = document.getElementById("add-button");
var newTaskInput = document.querySelector("textarea");
var todolistContainer = document.getElementById("todolist-container");
var templateElement = document.getElementById("list-item-template");
var template = templateElement.innerHTML; //the actual inner html of the template element you've retrieved above
var form = document.querySelector('form');

if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function ready() {
    displayToDos('/get-todos');
}

form.addEventListener('submit', function (event) {
    event.preventDefault(); 
    var formActionUrl = form.action;
    console.log("form action is: " + formActionUrl + " and type is: " + typeof (formActionUrl));
    var formData = new FormData(form);
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    postToDos(formActionUrl, formData);
});

newTaskInput.onkeypress = function (evt) {
    if (evt.which === 13) {
        evt.preventDefault();
        if (newTaskInput.focus) {
            addTaskButton.click();
        }
    }
}

function postToDos(url, data) {
    //console.log("you got to the post to dos method");
    fetch(url, {
        method: 'POST',
        body: data
    })
        .then((res) => {
            res.json()
                .then(function (json) { 
                    var id = json.id;
                    var newToDo = json.name;
                    console.log("new to do: " + newToDo);
                    var complete = json.complete;
                    addToDo(id, newToDo, complete);
                    document.querySelector("form").reset();
                })
        })
        .catch((err) => {
            console.error(err);
        });
}

function displayToDos(url) {
    fetch(url, {
        method: 'GET'
    })
        .then(function (res) {
            res.json()
                .then(function (json) {
                    console.log(json);
                    showToDosOnPage(json);
                });
        })
        .catch(function (err) {
            console.error(err);
        });
}

function showToDosOnPage(json) {
    console.log("in showtodos method");
    console.log("json length: " + json.length);
    for (var i = 0; i < json.length; i++) {
        //console.log("inthe for loop");
        //console.log(json[i]);
        let id = json[i].id;
        let name = json[i].name;
        let completed = json[i].complete;
        //console.log(name);
        addToDo(id, name, completed);
    }
}

var addToDo = function (id, taskName, complete) { //add id as a parameter
    var taskHTML = template.replace("<!--TASK_NAME-->", taskName);
    taskHTML = taskHTML.replace("\"/%IDNEEDED%/\"", id);
    if (complete == true) {
        taskHTML = taskHTML.replace("/%COMPLETE%/", " completed");
        taskHTML = taskHTML.replace("\"/%CHECK%/\"", "checked");
    }
    else {
        taskHTML = taskHTML.replace("/%COMPLETE%/", "");
        taskHTML = taskHTML.replace("\"/%CHECK%/\"", "");
    }
    todolistContainer.insertAdjacentHTML("afterbegin", taskHTML);
};


//adds a listener to the to do list container to check the checkbox when clicked
todolistContainer.addEventListener("click", function (event) {
    var targetElement = event.toElement; 
    var clickedElement = targetElement;
    while (!targetElement.classList.contains("task")) { 
        targetElement = targetElement.parentElement;
    }
    var id = targetElement.id;
    if ((clickedElement.classList.contains("task-name")) || (clickedElement.classList.contains("checkbox"))) {
        updateCompleteJson(targetElement, "/checkbox-changed");
    }
    else if (clickedElement.classList.contains("delete-button")) {
        deleteTodo('delete-todo', id);
    }
    
    else if (clickedElement.classList.contains("edit-button")) {
        var editButton = clickedElement;
        if (editButton.classList.contains("edit-mode")) {
            var listItem = targetElement.querySelector(".task-text");
            listItem.contentEditable = true;
            listItem.classList.add("editing");
            listItem.classList.add("editable");
            editButton.classList.remove("edit-mode");
            editButton.classList.add("save-mode");
            var checkbox = targetElement.querySelector(".checkbox");
            checkbox.disabled = true;
            editButton.innerText = "Save";

            listItem.onkeypress = function (evt) {
                if (evt.which === 13) {
                    evt.preventDefault();
                    editButton.click();
                }
            }
        }
        // if clicking the button should save the to-do, save the changes and change the button back to edit
        else if (editButton.classList.contains("save-mode")) {
            var listItem = targetElement.querySelector(".task-text");
            listItem.classList.remove("editable");
            listItem.contentEditable = false;
            var checkbox = targetElement.querySelector(".checkbox");
            checkbox.disabled = false;
            editButton.innerText = "Edit";
            editButton.classList.remove("save-mode");
            editButton.classList.add("edit-mode");
            listItem.classList.remove("editing");
            var newListItem = listItem.innerHTML;
            console.log("new task name: " + newListItem);
            updateToDoContents('/edit-todo', id, newListItem);
            
        }


    }
});

deleteTodo = (url, id) =>{
    var deleteUrl = "/delete-todo/" + id;
    fetch(deleteUrl, {
        method: 'DELETE'
    })
    .then(function(res){
        location.reload();
    });
}

updateToDoContents = (url, id, newTask) => {
    var data = { "id": id, "newTask": newTask };
    fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) //need to do this here
    })
}

updateCompleteJson = (todo, url) => {
    var checkbox = todo.querySelector(".checkbox");
    var completedStatus = false;
    var listItem = todo.querySelector(".task-text").innerText;
    if (checkbox.checked) { //use a "completed" class to track which items are complete
        todo.classList.add("completed");
        completedStatus = true;
    }
    else {
        todo.classList.remove("completed");
        completedStatus = false;
    }
    var data = { "name": listItem, "complete": completedStatus };
    console.log(data);
    fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) //need to do this here
    })
}

// on mouse over the list item (words or checkbox), set the visibility of the delete and edit buttons to visible.
todolistContainer.addEventListener("mouseover", function (event) {
    var targetElement = event.toElement;
    if (targetElement.tagName != "UL") {
        while (!targetElement.classList.contains("task")) {
            targetElement = targetElement.parentElement;
        }
        var deleteButton = targetElement.querySelector(".delete-button");
        var genericButton = targetElement.querySelector(".edit-button");
        deleteButton.classList.add("buttonVisible");
        genericButton.classList.add("buttonVisible");
        targetElement.onmouseout = function () {
            deleteButton.classList.remove("buttonVisible");
            genericButton.classList.remove("buttonVisible");
        }
    }
});