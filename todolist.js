
var addTaskButton = document.getElementById("add-button") ;
var newTaskInput = document.getElementById("new-task-input");
var todolistContainer = document.getElementById("todolist-container"); 
var templateElement = document.getElementById("list-item-template");
var template = templateElement.innerHTML; //the actual inner html of the template element you've retrieved above

//adds a listener to the add button
 addTaskButton.addEventListener("click", function(event){ 
    var taskName = newTaskInput.value;
    newTaskInput.value = "";
    if (taskName !=""){
        var taskHTML = template.replace("<!--TASK_NAME-->" , taskName); 
        todolistContainer.insertAdjacentHTML("afterbegin", taskHTML);
    } 

    
});

newTaskInput.onkeypress = function(evt) {
        if (evt.which === 13) {
            evt.preventDefault();
            if (newTaskInput.focus){
            addTaskButton.click();
        }
        }

        }

//adds a listener to the to do list container to check the checkbox when clicked
 todolistContainer.addEventListener("click", function(event){ 
    var targetElement = event.toElement; //get the element that was clicked
    while (!targetElement.classList.contains("task")){ //move up the DOM tree by getting the parent of the element that was clicked until you reach the task list item
        targetElement = targetElement.parentElement;
        //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    }

    var checkbox = targetElement.querySelector(".checkbox"); 
    var listItem = targetElement.querySelector(".task-text");
    if (checkbox.checked) { //use a "completed" class to track which items are complete
        targetElement.classList.add("completed");
    }

    else{
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
    var genericButton = targetElement.querySelector(".edit-button");
    deleteButton.classList.add("buttonVisible");
    genericButton.classList.add("buttonVisible");

    targetElement.addEventListener("mouseout", function(event){
    deleteButton.classList.remove("buttonVisible");
    genericButton.classList.remove("buttonVisible");
    });

});

// listens to the container to detect clicks on the delete or edit button
todolistContainer.addEventListener("click", function(event){
    var targetElement= event.toElement;
    var editButton = targetElement;

    if (targetElement.classList.contains("delete-button")){
        while (!targetElement.classList.contains("task")){
            targetElement=targetElement.parentElement;
        } // NOTE TO SELF: refactor to prevent redundancy of these while loops!
        var ul = targetElement.parentNode; //this line gets called twice! once before and once after the child is removed - repeats even MORE times after clicking the edit button!
        ul.removeChild(targetElement); //why is there an error here? Decides ul is null??? - anonymous has something to do with these all being anonymous functions. 
            
    
        }



    // if the edit button was clicked
    else if (targetElement.classList.contains("edit-button")){
        //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
        while (!targetElement.classList.contains("task")){
            targetElement=targetElement.parentElement;
            //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    }
    
    // if clicking the button should trigger editing, enable edit mode and change the button to save
    if (editButton.classList.contains("edit-mode")){
            while (!targetElement.classList.contains("task")){
                targetElement=targetElement.parentElement;
            } 
            var listItem = targetElement.querySelector(".task-text");
            listItem.contentEditable = true;
            listItem.classList.add("editing");
            listItem.classList.add("editable");
            editButton.classList.remove("edit-mode");
            editButton.classList.add("save-mode");
            var checkbox = targetElement.querySelector(".checkbox");
            checkbox.disabled = true;
            editButton.innerText= "Save";
            
            listItem.onkeypress = function(evt) {
                if (evt.which === 13) {
                    evt.preventDefault();
                    editButton.click();
                }
            }

    }
    // if clicking the button should save the to-do, save the changes and change the button back to edit
    else if (editButton.classList.contains("save-mode")) {
                while (!targetElement.classList.contains("task")){
                    targetElement=targetElement.parentElement;
                } 
                var listItem = targetElement.querySelector(".task-text");
                listItem.classList.remove("editable");
                listItem.contentEditable = false;
                var checkbox = targetElement.querySelector(".checkbox");
                checkbox.disabled = false; 
                editButton.innerText="Edit";
                editButton.classList.remove("save-mode");
                editButton.classList.add("edit-mode");
                listItem.classList.remove("editing");
}


    }
});







/* Functionality to add or fix:

- refactor to have your "addeventlistener" etc. called in an onload function, might want to give your functions names.
- add restrictions for editing- max length etc.
- add local storage mechanism so that the app can save state and maintain to dos after the window is closed
- prevent a user from adding a blank task
- move complete items to move to the bottom of the list/add them to a different list
- think about reusable code and not repeating the same thing (ie that while loop - can you take it out and make it a method?)
- security: check xss etc.
- css and appearance: 
    add some kind of margin to the second line of a task so it's under the first line of text, not under the textbox.
    improve the textbox shadowing/glow effect
    get the cursor inside the contentEditable box  */
