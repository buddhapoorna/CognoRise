const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const completedTasksCounter = document.getElementById('completed-tasks');
const remainingTasksCounter = document.getElementById('remaining-tasks');
const showAllButton = document.getElementById('show-all');
const showCompletedButton = document.getElementById('show-completed');
const showRemainingButton = document.getElementById('show-remaining');


let completedCount = 0;
let remainingCount = 0;


form.addEventListener('submit', function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim(); 

    if (taskText === '') {
        alert('Please enter a task.'); 
        return;
    }

    
    const task = {
        id: Date.now(),
        text: taskText,
        deadline: null,
        completed: false
    };

    // Add task to the list and save to localStorage
    addTask(task);

    // Reset the form
    taskInput.value = '';
});


function addTask(task) {
    const li = document.createElement('li');
    li.classList.add('task');
    li.innerHTML = `
        <span>${task.text}</span>
        <span class="deadline">${task.deadline ? formatDeadline(task.deadline) : 'No deadline set'}</span>
        <div class="task-buttons">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
            ${task.deadline ? `<button class="edit-deadline-button">Edit Deadline</button>` : `<button class="set-deadline-button">Set Deadline</button>`}
            <button class="complete-button">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </div>
    `;
    li.dataset.taskId = task.id; 
    if (task.completed) {
        li.classList.add('task-completed');
        completedCount++;
    } else {
        remainingCount++;
    }
    taskList.appendChild(li);

    // Check if task is overdue
    checkTaskDeadline(li, task.deadline);

    // Save tasks to localStorage
    saveTasks();

    // Update task counters
    updateTaskCounters();
}


function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        id: li.dataset.taskId,
        text: li.querySelector('span').textContent,
        deadline: parseInt(li.querySelector('.deadline').dataset.deadline) || null,
        completed: li.classList.contains('task-completed')
    }));

    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTask(task);
    });

 
    completedCount = tasks.filter(task => task.completed).length;
    remainingCount = tasks.filter(task => !task.completed).length;
    updateTaskCounters();
}


function formatDeadline(timestamp) {
    const deadlineDate = new Date(timestamp);
    return deadlineDate.toLocaleString();
}


function checkTaskDeadline(taskElement, deadline) {
    if (deadline && Date.now() > deadline) {
        taskElement.classList.add('task-overdue');
    }
}


taskList.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('delete-button')) {
        const taskElement = target.parentElement.parentElement;
        if (taskElement.classList.contains('task-completed')) {
            completedCount--;
        } else {
            remainingCount--;
        }
        taskElement.remove(); 
        saveTasks(); 
    } else if (target.classList.contains('edit-button')) {
        const newText = prompt('Edit task:', target.parentElement.parentElement.querySelector('span').textContent);
        if (newText !== null) {
            target.parentElement.parentElement.querySelector('span').textContent = newText;
            saveTasks(); 
        }
    } else if (target.classList.contains('set-deadline-button')) {
        const taskElement = target.parentElement.parentElement;
        const taskId = taskElement.dataset.taskId;

        
        const deadlineInput = prompt('Set deadline for the task (YYYY-MM-DD HH:MM):');
        if (deadlineInput === null || deadlineInput.trim() === '') {
            alert('Please enter a valid deadline for the task.');
            return;
        }

        const deadline = new Date(deadlineInput).getTime(); 

        if (isNaN(deadline)) {
            alert('Please enter a valid date and time format (YYYY-MM-DD HH:MM).');
            return;
        }

        
        const deadlineElement = taskElement.querySelector('.deadline');
        deadlineElement.textContent = formatDeadline(deadline);
        deadlineElement.dataset.deadline = deadline;
        target.textContent = 'Edit Deadline';
        target.classList.remove('set-deadline-button');
        target.classList.add('edit-deadline-button');

        
        checkTaskDeadline(taskElement, deadline);

        saveTasks(); 
    } else if (target.classList.contains('edit-deadline-button')) {
        const taskElement = target.parentElement.parentElement;
        const taskId = taskElement.dataset.taskId;

        
        const newDeadlineInput = prompt('Enter new deadline for the task (YYYY-MM-DD HH:MM):');
        if (newDeadlineInput === null || newDeadlineInput.trim() === '') {
            alert('Please enter a valid deadline for the task.');
            return;
        }

        const newDeadline = new Date(newDeadlineInput).getTime(); // Convert deadline to UNIX timestamp

        if (isNaN(newDeadline)) {
            alert('Please enter a valid date and time format (YYYY-MM-DD HH:MM).');
            return;
        }

        
        const deadlineElement = taskElement.querySelector('.deadline');
        deadlineElement.textContent = formatDeadline(newDeadline);
        deadlineElement.dataset.deadline = newDeadline;

        
        checkTaskDeadline(taskElement, newDeadline);

        saveTasks(); 
    } else if (target.classList.contains('complete-button')) {
        const taskElement = target.parentElement.parentElement;
        taskElement.classList.toggle('task-completed');
        if (taskElement.classList.contains('task-completed')) {
            completedCount++;
            remainingCount--;
            target.textContent = 'Uncomplete';
        } else {
            completedCount--;
            remainingCount++;
            target.textContent = 'Complete';
        }
        saveTasks(); 
        updateTaskCounters(); 
    }
});


showAllButton.addEventListener('click', function() {
    Array.from(taskList.children).forEach(task => {
        task.style.display = '';
    });
});

showCompletedButton.addEventListener('click', function() {
    Array.from(taskList.children).forEach(task => {
        if (task.classList.contains('task-completed')) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
});

showRemainingButton.addEventListener('click', function() {
    Array.from(taskList.children).forEach(task => {
        if (task.classList.contains('task-completed')) {
            task.style.display = 'none';
        } else {
            task.style.display = '';
        }
    });
});


function updateTaskCounters() {
    completedTasksCounter.textContent = completedCount;
    remainingTasksCounter.textContent = remainingCount;
}


loadTasks();
