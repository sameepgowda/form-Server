"use strict";
// Get HTML elements
const taskForm = document.querySelector("#taskForm");
const taskNameInput = document.querySelector("#taskName");
const dueDateInput = document.querySelector("#dueDate");
const taskList = document.querySelector("#taskList");
// Load existing tasks from localStorage
let tasks = [];
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
    try {
        tasks = JSON.parse(savedTasks);
    }
    catch {
        tasks = [];
    }
}
// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Display tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        // Task name and due date
        const taskDetails = document.createElement("span");
        taskDetails.textContent = `${task.name} - Due: ${task.dueDate}`;
        if (task.completed) {
            taskDetails.classList.add("completed");
        }
        // Toggle completed status
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            renderTasks();
        });
        li.appendChild(checkbox);
        li.appendChild(taskDetails);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}
// Add a new task
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name || !dueDate) {
        return;
    }
    const newTask = {
        id: Date.now(),
        name: name,
        dueDate: dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
});
// Initial rendering
renderTasks();
