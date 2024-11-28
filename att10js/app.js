
let tasks = [];
let filterMode = "all"; // 'all', 'completed', 'pending'
let sortMode = "none"; // 'none', 'priority', 'date'


const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterButton = document.getElementById("filterButton");
const sortButton = document.getElementById("sortButton");


taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskPriority = document.getElementById("taskPriority").value;

  tasks.push({
    name: taskName,
    date: new Date(taskDate),
    priority: taskPriority,
    completed: false,
  });

  taskForm.reset();
  renderTasks();
});


function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;


  if (filterMode === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filterMode === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  
  if (sortMode === "priority") {
    filteredTasks.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } else if (sortMode === "date") {
    filteredTasks.sort((a, b) => a.date - b.date);
  }


  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    
    if (task.completed) {
      taskItem.classList.add("completed");
    }

    
    if (isUrgent(task.date)) {
      taskItem.classList.add("urgent");
    }

    
    taskItem.innerHTML = `
      <span>
        <strong class="priority-${task.priority}">${task.name}</strong> 
        - ${task.date.toISOString().split("T")[0]}
      </span>
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} 
          onclick="toggleCompletion(${index})">
        <button onclick="editTask(${index})">Editar</button>
        <button onclick="deleteTask(${index})">Excluir</button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });
}


function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}


function editTask(index) {
  const task = tasks[index];
  const newName = prompt("Novo nome da tarefa:", task.name);
  const newDate = prompt("Nova data (yyyy-mm-dd):", task.date.toISOString().split("T")[0]);
  const newPriority = prompt("Nova prioridade (high, medium, low):", task.priority);

  if (newName) task.name = newName;
  if (newDate) task.date = new Date(newDate);
  if (newPriority) task.priority = newPriority;

  renderTasks();
}


function isUrgent(date) {
  const today = new Date();
  const diffTime = date - today;
  return diffTime <= 3 * 24 * 60 * 60 * 1000 && diffTime > 0; 
}


filterButton.addEventListener("click", () => {
  if (filterMode === "all") {
    filterMode = "completed";
    filterButton.textContent = "Mostrar Pendentes";
  } else if (filterMode === "completed") {
    filterMode = "pending";
    filterButton.textContent = "Mostrar Todas";
  } else {
    filterMode = "all";
    filterButton.textContent = "Filtrar Concluídas";
  }
  renderTasks();
});


sortButton.addEventListener("click", () => {
  if (sortMode === "none") {
    sortMode = "priority";
    sortButton.textContent = "Ordenar por Data";
  } else if (sortMode === "priority") {
    sortMode = "date";
    sortButton.textContent = "Sem Ordenação";
  } else {
    sortMode = "none";
    sortButton.textContent = "Ordenar por Prioridade";
  }
  renderTasks();
});


renderTasks();
