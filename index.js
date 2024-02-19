const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
  console.log(id);
  return id;
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data ? data : todos;

  todosBody.innerHTML = "";
  if (todos.length === 0) {
    todosBody.innerHTML = "<tr><td colspan='4'> NO task found! </td></tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosBody.innerHTML =
      todosBody.innerHTML +
      `<tr>
    <td>${todo.task}</td>
    <td>${todo.date ? todo.date : "No date"}</td>
    <td>${todo.completed ? "completed" : "pending"}</td>
    <td>
    
        <button onclick="editHandler(${todo.id})">Edit</button>
        <button onclick="toggleHandler(${todo.id})">${
        todo.completed ? "Undo" : "Do"
      }
      </button>
        <button onclick="deleteHandler(${todo.id})">Delete</button>

    </td>
    `;
  });
};
const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    generateId();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("todo added successfully", "success");
  } else {
    showAlert("pleaser enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);

  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo delete successfully", "success");
};
const toggleHandler = (id) => {
  const newTodos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        id: todo.id,
        task: todo.task,
        date: todo.date,
        completed: !todo.completed,
      };
    } else {
      return todo;
    }
  });
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("todo status change successfully", "success");
};
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);

  taskInput.value = todo.task;
  dateInput.value = todo.date;
  editButton.style.display = "inline-block";
  addButton.style.display = "none";
  editButton.dataset = id;
};
const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput = "";
  dateInput = "";
  editButton.style.display = "none";
  addButton.style.display = "inline-block";
  saveToLocalStorage();
  displayTodos();
  showAlert("todo edited change successfully", "success");
};
const filterHandler = () => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
