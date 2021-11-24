let tasks = []; //empty array to hold all tasks and their values for saving to localstorage
let formEl = document.querySelector("#task-form");
let taskIdCounter = 0;
let pageContentEl = document.querySelector("#page-content");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");

let taskFormHandler = function (event) {
    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if inputs are empty (validate)
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form fields for next task to be entered
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;

    // check if task is new or one being edited by seeing if it has a data-task-id attribute
    let isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        let taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do",
        };

        createTaskEl(taskDataObj);
    }
};


function createTaskEl(taskDataObj) {
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML =
        "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    let taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.append(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.append(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
        default:
            console.log("Something went wrong!");
    }
    // save task as an object with name, type, status, and id properties then push it into tasks array
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // save tasks to localStorage
    saveTasks();

    // increase task counter for next unique task id
    taskIdCounter++;
};

//Create buttonand drop down elelemtns for each item
function createTaskActions(taskId) {
    // create container to hold elements
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create change status dropdown
    let statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);
    // create status options
    let statusChoices = ["To Do", "In Progress", "Completed"];

    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

function completeEditTask(taskName, taskType, taskId) {
    // find task item with taskId value
    let taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    // set new values for text content
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");

    // remove  attribute
    formEl.removeAttribute("data-task-id");
    //  mset formEl back to add test
    formEl.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};

//Task Handler Function//
function taskButtonHandler(event) {
    // define target element  with let
    let targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        let taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        let taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//Edit Task Function//
function editTask(taskId) {
    console.log(taskId);

    // get task item element
    let taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );

    // get task name and task type
    let taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    let taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values back to form 
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
};

///Delete task function//
function deleteTask(taskId) {
    console.log(taskId);
    //get tast to delete
    let taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    taskSelected.remove();

    // create new array to hold updated tasks
    let updatedTaskArr = [];

    // check each task and add it to the new array if it is NOT the task we want to delete
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // update tasks to reflect new array of tasks
    tasks = updatedTaskArr;
    saveTasks();
};



function taskStatusChangeHandler(event) {

    let taskId = event.target.getAttribute("data-task-id");

    let taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );

    //needs to be lower case for future proofing
    let statusValue = event.target.value.toLowerCase();

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task in tasks array
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    
    saveTasks();
};

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (let i = 0; i < savedTasks.length; i++) {
        // pass each task object into the `createTaskEl()` function
        createTaskEl(savedTasks[i]);
    }


}

formEl.addEventListener('submit', taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

//check if something is changed. we are looking for the select option to change on any of the li elements
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();