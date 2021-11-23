let taskToDoEl = document.querySelector('#task-to-do');
let formEl = document.querySelector("#task-form");


function createTaskHandler(event) {
    let formEl = document.querySelector("#task-form");//define the entire form elemnt
    let taskToDoEl = document.querySelector("#task-to-do"); //define the ul list element
    event.preventDefault();

    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;
    //create task list element and give it a class
    let listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    //create div to hold task info and give it a class
    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

    //add entire div item to list item
    listItemEl.appendChild(taskInfoEl)
    //add the list item to the ul list
    taskToDoEl.appendChild(listItemEl);
}

formEl.addEventListener('submit', createTaskHandler);
