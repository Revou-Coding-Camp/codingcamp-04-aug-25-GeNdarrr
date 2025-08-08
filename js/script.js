let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editIndex = null;

const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const message = document.getElementById("message");
const todoList = document.getElementById("todoList");
const filter = document.getElementById("filter");
const clearAllBtn = document.getElementById("clearAllBtn");

function showMessage(msg, type) {
  message.textContent = msg;
  message.style.color = type === "error" ? "red" : "lightgreen";
  setTimeout(() => (message.textContent = ""), 2000);
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTasks();
}

function renderTasks() {
  const selected = filter.value;
  todoList.innerHTML = "";

  const filteredTodos =
    selected === "all" ? todos : todos.filter((t) => t.status === selected);

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" style="text-align:center; font-style:italic;">No task found</td></tr>`;
    return;
  }

  filteredTodos.forEach((todo, index) => {
    const row = document.createElement("tr");

    // Kolom Task
    const taskCell = document.createElement("td");
    taskCell.textContent = todo.text;

    // Kolom Date
    const dateCell = document.createElement("td");
    dateCell.textContent = todo.date;

    // Kolom Status (label berwarna)
    const statusCell = document.createElement("td");
    statusCell.className =
      todo.status === "completed" ? "status-completed" : "status-pending";
    statusCell.textContent =
      todo.status === "completed" ? "Completed" : "Pending";

    // Kolom Action (tombol)
    const actionCell = document.createElement("td");
    actionCell.classList.add("actions");

    // Tombol Toggle Status
    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML =
      todo.status === "completed"
        ? '<span class="material-icons">check_circle</span>'
        : '<span class="material-icons">hourglass_empty</span>';
    if (todo.status === "completed") toggleBtn.classList.add("completed");

    toggleBtn.onclick = () => {
      todo.status = todo.status === "completed" ? "pending" : "completed";
      showMessage("Status updated", "success");
      saveAndRender();
    };

    // Tombol Edit
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<span class="material-icons">edit</span>';
    editBtn.onclick = () => {
      todoInput.value = todo.text;

      // Parse date ke format yyyy-mm-dd supaya bisa masuk ke input date
      const parts = todo.date.split("/");
      if (parts.length === 3) {
        const formatted = `${parts[2]}-${parts[1].padStart(
          2,
          "0"
        )}-${parts[0].padStart(2, "0")}`;
        dateInput.value = formatted;
      }

      editIndex = index;
      addBtn.innerHTML = '<span class="material-icons">save</span>';
    };

    // Tombol Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
    deleteBtn.onclick = () => {
      const confirmDelete = confirm(`Delete task:\n"${todo.text}"?`);
      if (confirmDelete) {
        todos.splice(index, 1);
        showMessage("Task deleted", "success");
        saveAndRender();
      }
    };

    actionCell.append(toggleBtn, editBtn, deleteBtn);
    row.append(taskCell, dateCell, statusCell, actionCell);
    todoList.appendChild(row);
  });
}

// Tambah / Update Task
addBtn.onclick = () => {
  const text = todoInput.value.trim();
  const date = dateInput.value;

  if (!text && !date) return showMessage("Task and date are required", "error");
  if (!text) return showMessage("Task is required", "error");
  if (!date) return showMessage("Date is required", "error");

  const formattedDate = new Date(date).toLocaleDateString("id-ID");

  if (editIndex !== null) {
    todos[editIndex] = {
      ...todos[editIndex],
      text,
      date: formattedDate,
    };
    showMessage("Task updated", "success");
    editIndex = null;
    addBtn.innerHTML = '<span class="material-icons">add</span>';
  } else {
    todos.push({ text, date: formattedDate, status: "pending" });
    showMessage("Task added", "success");
  }

  todoInput.value = "";
  dateInput.value = "";
  saveAndRender();
};

// Filter Tasks
filter.onchange = renderTasks;

// Clear All Tasks
clearAllBtn.onclick = () => {
  const confirmClear = confirm("Are you sure you want to delete all tasks?");
  if (confirmClear) {
    todos = [];
    showMessage("All tasks deleted", "success");
    saveAndRender();
  }
};

renderTasks();
