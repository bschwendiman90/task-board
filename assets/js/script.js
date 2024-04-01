

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
   return crypto.randomUUID()
}

// Todo: create a function to create a task card
function createTaskCard(task) {


}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // ? Empty existing project cards out of the lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // ? Loop through projects and create project cards for each status
  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  // ? Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
$('#addTaskBtn').on('click', function(event){
    $('taskModal').modal('show');
});
$('#taskModal').on('click', '#addTaskSubmitBtn', function(event){
    event.preventDefault();

    const taskTitle = $('#task-title').val();
    const taskDueDate = $('#task-due-date').val();
    const taskDescription = $('#task-description').val();

    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status:'to-do',
    }

    console.log(newTask);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();

    $('#task-title').val('');
    $('#task-due-date').val('');
    $('#task-description').val('');
    
    $('#taskModal').modal('hide');
})
}



// Todo: create a function to handle deleting a task
function handleDeleteTask(){
    const taskId = $(this).attr('data-project-id');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task) => {
        if (task.id === taskId) {
          tasks.splice(tasks.indexOf(task), 1);
        }
      });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // ? Read projects from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // ? Get the project id from the event
  const taskId = ui.draggable.attr('data-project-id');

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem('tasks', JSON.stringify(tasks));
 renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
    renderTaskList();
    
    handleAddTask();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

    $( "#task-due-date" ).datepicker({
        changeMonth: true,
        changeYear: true
      });

});
