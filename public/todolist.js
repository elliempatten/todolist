if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function ready() {
    readToDos('/todo');
    setupListeners();
}

// setup
var setupListeners = function () {
    var addTaskButton = document.getElementById("add-button");
    var newTaskInput = document.querySelector("textarea");
    var todolistContainer = document.getElementById("todolist-container");
    var form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(form);
        var name;
        for (var pair of formData.entries()) {
            name = pair[1];
        }
        if (name.replace(/^\s+/, '').replace(/\s+$/, '').length != 0) {
            console.log(name);
            var url = "/todo";
            var id = "";
            var complete = false;
            createToDo(url, id, name, complete);
        }
        else {
            alert("you can't add a blank to do!"); // later, change this to a nice banner.
        }
    });

    newTaskInput.onkeypress = function (evt) {
        if (evt.which === 13) {
            evt.preventDefault();
            if (newTaskInput.focus) {
                addTaskButton.click();
            }
        }
    }

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

    todolistContainer.addEventListener("click", function (event) {
        var targetElement = event.toElement;
        var clickedElement = targetElement;
        while (!targetElement.classList.contains("task")) {
            targetElement = targetElement.parentElement;
        }
        var id = targetElement.id;
        var name = targetElement.querySelector(".task-text").innerText;
        if (clickedElement.classList.contains("delete-button")) {
            deleteTodo(id);
            console.log("delete method called: " + id);
        }
        else {
            var complete = (targetElement.classList.contains("completed"));
            if ((clickedElement.classList.contains("task-name")) || (clickedElement.classList.contains("checkbox"))) {
                complete = targetElement.classList.contains("completed") ? markIncomplete(targetElement) : markComplete(targetElement);
            }
            if (clickedElement.classList.contains("edit-button")) {
                targetElement.classList.contains("editable") ? save(targetElement, clickedElement) : edit(targetElement, clickedElement)
            }
            updateToDo(id, name, complete);
        }
    });

}
// helper methods


var addToDoToPage = function (id, taskName, complete) {
    var todolistContainer = document.getElementById("todolist-container");
    var template = document.getElementById("list-item-template").innerHTML;
    var taskHTML = template.replace("<!--TASK_NAME-->", taskName);
    taskHTML = taskHTML.replace("\"/%IDNEEDED%/\"", id);
    if (complete == true) {
        taskHTML = taskHTML.replace("/%COMPLETE%/", " completed");
        taskHTML = taskHTML.replace("/%CHECK%/", "checked");
    }
    else {
        taskHTML = taskHTML.replace("/%COMPLETE%/", "");
        taskHTML = taskHTML.replace("/%CHECK%/", "");
    }
    todolistContainer.insertAdjacentHTML("afterbegin", taskHTML);
};

var edit = function (targetElement, clickedElement) {
    var listItem = targetElement.querySelector(".task-text");
    var checkbox = targetElement.querySelector(".checkbox");
    listItem.contentEditable = true;
    targetElement.classList.add("editable");
    checkbox.disabled = true;
    clickedElement.innerText = "Save";
    listItem.onkeypress = function (evt) {
        if (evt.which === 13) {
            evt.preventDefault();
            clickedElement.click();
        }
    }
}

var save = function (targetElement, clickedElement) {
    var listItem = targetElement.querySelector(".task-text");
    var checkbox = targetElement.querySelector(".checkbox");
    listItem.contentEditable = false;
    checkbox.disabled = false;
    clickedElement.innerText = "Edit";
    targetElement.classList.remove("editable");
    name = listItem.innerHTML;
}

var markComplete = function (targetElement) {
    var checkbox = targetElement.querySelector(".checkbox");
    targetElement.classList.add("completed");
    checkbox.setAttribute("checked", "true");
    return true;
}

var markIncomplete = function (targetElement) {
    targetElement.classList.remove("completed");
    var checkbox = targetElement.querySelector(".checkbox");
    checkbox.removeAttribute("checked");
    return false;
}

var getToDosFromJson = function (json) {
    for (var i = 0; i < json.length; i++) {
        let id = json[i].id;
        let name = json[i].name;
        let completed = json[i].complete;
        addToDoToPage(id, name, completed);
    }
}

// API calls
var deleteTodo = function (id) {
    var deleteUrl = "/todo/" + id;
    fetch(deleteUrl, {
        method: 'DELETE'
    })
        .then(function () {
            location.reload();
        });
}

var readToDos = function (url) {
    fetch(url, {
        method: 'GET'
    })
        .then(function (res) {
            res.json()
                .then(function (json) {
                    console.log("json: " + json);
                    console.log("json length: " + json.length);
                    if (json.length > 0) {
                        getToDosFromJson(json);
                        document.getElementsByClassName("no-todo-message")[0].classList.add("hide-message");
                    }
                    else {
                        document.getElementsByClassName("no-todo-message")[0].classList.remove("hide-message");
                    }
                });
        })
        .catch(function (err) {
            console.error(err);
        });
}

var createToDo = function (url, id, name, complete) {
    var todo = { "id": id, "name": name, "complete": complete };
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    })
        .then((res) => {
            res.json()
                .then(function (json) {
                    var id = json.id;
                    var newToDo = json.name;
                    var complete = json.complete;
                    document.getElementsByClassName("no-todo-message")[0].classList.add("hide-message");
                    addToDoToPage(id, newToDo, complete);
                    document.querySelector("form").reset();
                })
        })
        .catch((err) => {
            console.error(err);
        });
}

var updateToDo = function (id, name, complete) {
    var uri = "/todo/" + id;
    var data = { "id": id, "newTask": name, "complete": complete };
    fetch(uri, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) //need to do this here
    })
}