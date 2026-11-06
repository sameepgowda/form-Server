interface Task {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

// Get HTML elements
const taskForm = document.querySelector<HTMLFormElement>("#taskForm")!;
const taskNameInput = document.querySelector<HTMLInputElement>("#taskName")!;
const dueDateInput = document.querySelector<HTMLInputElement>("#dueDate")!;
const taskList = document.querySelector<HTMLUListElement>("#taskList")!;

// Load existing tasks from localStorage
let tasks: Task[] = [];

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    try {
        tasks = JSON.parse(savedTasks) as Task[];
    } catch {
        tasks = [];
    }
}

// Save tasks to localStorage
function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks(): void {

    taskList.innerHTML = "";

    tasks.forEach((task: Task) => {

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

            tasks = tasks.filter((item: Task) => item.id !== task.id);

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
taskForm.addEventListener("submit", (event: SubmitEvent) => {

    event.preventDefault();

    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!name || !dueDate) {
        return;
    }

    const newTask: Task = {
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