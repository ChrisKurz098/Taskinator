
let buttonEl  = document.querySelector("#save-task");
let taskToDoEl = document.querySelector('#task-to-do');

function createTaskHandler(){
    let taskItemEl = document.createElement('li');
    taskItemEl.textContent= "Hello";
    taskItemEl.className='task-item';
    taskToDoEl.appendChild(taskItemEl);
}

buttonEl.addEventListener('click', createTaskHandler);
