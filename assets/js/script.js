let formEl = document.querySelector("#task-form");

var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
let tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

function taskFormHandler(event) {
    event.preventDefault();

    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();//resets the input values

    let isEdit = formEl.hasAttribute("data-task-id");
    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        }
        // send it as an argument to createTaskEl 
        createTaskEl(taskDataObj);
    }

}


function createTaskEl(taskDataObj) {
    //create task list element and give it a class
    let listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    listItemEl.setAttribute("data-task-Id", taskIdCounter);
    //create div to hold task info and give it a class
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    //add entire div item to list item
    listItemEl.appendChild(taskInfoEl);

    //run function to crete buttons and selections
    var taskActionsEl = createTaskActions(taskIdCounter);
    console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);
    taskIdCounter++;
}

//Create buttonand drop down elelemtns for each item
var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //add drop down
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "Status Change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);
    //create drop down options
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option elelemnt
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;

};

//Task Handler Function//
function taskButtonHandler(event) {


    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    else if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }


};

//Edit Task Function//
function editTask(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content for task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

///Delete task function//
function deleteTask(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id ='" + taskId + "']");

    taskSelected.remove();

}

function completeEditTask(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated");

    //remove data attribute as it signifies if we are in edit mpe or not
    formEl.removeAttribute("data-task-id");

    //change the button name back to add task
    document.querySelector("#save-task").textContent = "Add Task";

}

function taskStatusChangeHandler(event) {
    let taskId = event.target.getAttribute("data-task-id");
    let statusValue = event.target.value.toLowerCase();

    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }
}

formEl.addEventListener('submit', taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

//check if something is changed. we are looking for the select option to change on any of the li elements
pageContentEl.addEventListener("change", taskStatusChangeHandler);