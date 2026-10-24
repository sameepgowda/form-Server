
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const message = document.getElementById("message");


async function loadExpenses() {
    
        const response = await axios.get("http://localhost:3000/expense/getExpenses");

        const expenses = response.data.expenses;

        expenseList.innerHTML = "";

        expenses.forEach(expense => {
            displayExpense(expense);
        });

    
}


function displayExpense(expense) {
    const expenseDiv = document.createElement("div");

    const details = document.createElement("p");

    details.textContent =
        `Amount: ${expense.amount} | ` +
        `Description: ${expense.description} | ` +
        `Category: ${expense.category}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        deleteExpense(expense.id);
    });

    expenseDiv.appendChild(details);
    expenseDiv.appendChild(deleteButton);

    expenseList.appendChild(expenseDiv);
}


async function addExpense (event) {
    event.preventDefault();
    

    const expense = {
        amount: Number(document.getElementById("amount").value),
        description: document.getElementById("description").value,
        category: document.getElementById("category").value
    };

    
        await axios.post("http://localhost:3000/expense/addExpense", expense);

        message.textContent = "Expense added successfully";

        expenseForm.reset();

        await loadExpenses();

   
};

async function deleteExpense(id) {
    
        await axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`);

        

        await loadExpenses();

    
}

loadExpenses();
