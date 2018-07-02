
var addTaskButton = document.getElementById("add-button") ;
var newTaskInput = document.getElementById("new-task-input");
var todolistContainer = document.getElementById("todolist-container"); 
var templateElement = document.getElementById("list-item-template");
var template = templateElement.innerHTML; //the actual inner html of the template element you've retrieved above


addTaskButton.addEventListener("click", function(event){ //adding a listener to your button, and defining the function it uses. Following code triggered when button is clicked.
    var taskName = newTaskInput.value;
    newTaskInput.value = ""; //what happens if you remove this?

    var taskHTML = template.replace("<!--TASK_NAME-->" , taskName); //replaces the task name bit of the template with your actual task
    todolistContainer.insertAdjacentHTML("afterbegin", taskHTML); //appends this to the list
});


//continue with this - the next bit is about crossing them out and fading them. If you still want, from here you can probably move them to a completed list. Since you're obviously going to be able to access the list elements again. 

 todolistContainer.addEventListener("click", function(event){ //add a listener to your to do list container
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

// on mouse over the list item (words or checkbox), set the visibility of the delete button to visible.
todolistContainer.addEventListener("mouseover", function(event){
    var targetElement = event.toElement;
    console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    while (!targetElement.classList.contains("task")){
        targetElement=targetElement.parentElement;
        console.log("Target element is currently: " + targetElement.nodeName); //debugging purposes
    }
    var deleteButton = targetElement.querySelector(".delete-button");
    deleteButton.classList.add("buttonChange");

    targetElement.addEventListener("mouseout", function(event){
    deleteButton.classList.remove("buttonChange");
    });

    deleteButton.addEventListener("click", function(event){
        //console.log("delete button clicked");
        targetElement.parentNode.removeChild(targetElement);

    });


})


//make the delete button actually delete things.
// then get complete items to move to the bottom of the list
