
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
    var listItem = targetElement.querySelector(".task-text");
    if (checkbox.checked && !(listItem.classList.contains("editable"))) { //use a "completed" class to track which items are complete
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

    addEdit = editButton.onclick = (function(event){
        var targetElement = event.toElement;
        while (!targetElement.classList.contains("task")){
            targetElement=targetElement.parentElement;
        } 
        var listItem = targetElement.querySelector(".task-text");
        listItem.contentEditable = true;
        listItem.classList.add("editable");
        listItem.addEventListener('keypress', function(evt) {
            if (evt.which === 13) {
                evt.preventDefault();
            }
        });
        var checkbox = targetElement.querySelector(".checkbox");
        checkbox.disabled = true;
        editButton.innerText= "Save";
        
        editButton.onclick = (function(){ //why does it need to be clicked twice to save after editing?
            listItem.classList.remove("editable");
            listItem.contentEditable = false;
            checkbox.disabled = false;
            editButton.innerText="Edit";
            editButton.onclick = addEdit;



        });

            
        });

        deleteButton.onclick = (function(event){
            var targetElement = event.toElement;
            //console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
            while (!targetElement.classList.contains("task")){
                targetElement=targetElement.parentElement;
            }
                //console.log("delete button clicked");
            var ul = targetElement.parentNode; //this line gets called twice! once before and once after the child is removed - repeats even MORE times after clicking the edit button!
            ul.removeChild(targetElement); //why is there an error here? Decides ul is null??? - anonymous has something to do with these all being anonymous functions. 
                
        
            });


});





/* Functionality to add or fix:

- add restrictions for editing- max length etc.
- make sure strikethrough only applies to the todo text and not the buttons - DONE
- add an edit button to allow users to edit to do list - MAKE THE BUTTON FUNCTIONAL
- add local storage mechanism so that the app can save state and maintain to dos after the window is closed
- prevent a user from adding a blank task
- move complete items to move to the bottom of the list
- think about reusable code and not repeating the same thing (ie that while loop - can you take it out and make it a method?)
- css: add some kind of margin to the second line of a task so it's under the first line of text, not under the textbox */
