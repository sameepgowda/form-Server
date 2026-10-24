async function displayUsers () {
    let userList = document.getElementById("userList");
            userList.innerHTML = "";
            const response = await axios.get("http://localhost:3000/users/getUsers");
            console.log(response)
            

            response.data.userList.forEach(function (user, index) {
                const userDiv = document.createElement("div");
                userDiv.className = "user";

                const name = document.createElement("p");
                name.textContent = "Username: " + user.name;

                const email = document.createElement("p");
                email.textContent = "Email: " + user.email;

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.className = "edit";

                

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete";

                deleteBtn.addEventListener("click", async function () {
                        await axios.delete(`http://localhost:3000/users/deleteUser/${user.id}`);

                    displayUsers();
                });

                userDiv.append(name, email, editBtn, deleteBtn);
                userList.appendChild(userDiv);
            });
        }





async function submitForm(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    try {
        console.log("form submitted");
        const response = await axios.post("http://localhost:3000/users/insertUser", {
            name: username,
            email: email
        });
        displayUsers();


    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
}