

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
   return crypto.randomUUID()
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-project-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description)
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate)
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-project-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
          } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
          }
        } 

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    
    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  
  for (let task of tasks) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

 
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
   
    helper: function (e) {
      
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
     
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
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
  const taskId = ui.draggable.attr('data-project-id');

  
  const newStatus = event.target.id;

  for (let task of tasks) {
    
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  
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
