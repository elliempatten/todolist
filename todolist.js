
var addTaskButton = document.getElementById("add-button") ;
var newTaskInput = document.getElementById("new-task-input");
var todolistContainer = document.getElementById("todolist-container"); 
var templateElement = document.getElementById("list-item-template");
var template = templateElement.innerHTML; //the actual inner html of the template element you've retrieved above

//adds a listener to the add button
addTaskButton.addEventListener("click", function(event){ 
    var taskName = newTaskInput.value;
    newTaskInput.value = "";

    var taskHTML = template.replace("<!--TASK_NAME-->" , taskName); 
    todolistContainer.insertAdjacentHTML("afterbegin", taskHTML); 
});

//adds a listener to the to do list container to check the checkbox when clicked
 todolistContainer.addEventListener("click", function(event){ 
    var targetElement = event.toElement; //get the element that was clicked
    while (!targetElement.classList.contains("task")){ //move up the DOM tree by getting the parent of the element that was clicked until you reach the task list item
        targetElement = targetElement.parentElement;
        //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    }

    var checkbox = targetElement.querySelector(".checkbox"); 
    if (checkbox.checked) { //use a "completed" class to track which items are complete
        targetElement.classList.add("completed");
    }
    else {
        targetElement.classList.remove("completed");
    }
    //console.log("classes are: " + targetElement.classList); //debugging
}); 

// on mouse over the list item (words or checkbox), set the visibility of the delete and edit buttons to visible.
todolistContainer.addEventListener("mouseover", function(event){
    var targetElement = event.toElement;
    //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    while (!targetElement.classList.contains("task")){
        targetElement=targetElement.parentElement;
        //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    }
    var deleteButton = targetElement.querySelector(".delete-button");
    var editButton = targetElement.querySelector(".edit-button");
    deleteButton.classList.add("buttonVisible");
    editButton.classList.add("buttonVisible");

    targetElement.addEventListener("mouseout", function(event){
    deleteButton.classList.remove("buttonVisible");
    editButton.classList.remove("buttonVisible");
    });

    deleteButton.addEventListener("click", function(event){
        //console.log("delete button clicked");
        var ul = targetElement.parentNode;
        ul.removeChild(targetElement); //why is there an error here?

    });

    editButton.addEventListener("click", function(event){
        var listItem = targetElement.querySelector(".task-text");
        listItem.contentEditable = true;
        
    });


});

/*


/* Functionality to add or fix:
- fix the error that now occurs when deleting. If deleting an element, it starts talking about removing child of a null element (htmlbuttonelement)
- disable the checkbox when it's editable (as it's currently tricky to edit without checking off the list, and add some kind of border so it's obvious that it's now editable.
- add restrictions for editing- max length etc.
- make sure strikethrough only applies to the todo text and not the buttons - DONE
- add an edit button to allow users to edit to do list - MAKE THE BUTTON FUNCTIONAL
- add local storage mechanism so that the app can save state and maintain to dos after the window is closed
- prevent a user from adding a blank task
- move complete items to move to the bottom of the list */
