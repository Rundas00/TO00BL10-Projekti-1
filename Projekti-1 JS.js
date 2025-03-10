// script.js

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput"); //Syöttökenttä
    const addButton = document.getElementById("addButton"); // Nappi tehtävien öisäämistä varten
    const taskList = document.getElementById("taskList"); // tehtävälista
    const filterOptions = document.getElementById("filterOptions"); // Suodatinvalikko
    
    loadTasks(); // lataa tallennetut tehtävät localStoragesta

    addButton.addEventListener("click", addTask); // Lisää tehtävän kun napista painaa
    taskList.addEventListener("click", handleTaskClick); // tehtävä tehty/poista
    filterOptions.addEventListener("change", filterTasks); // Suodattaa tehtävän valintojen mukaan

    function addTask() {
        const taskText = taskInput.value.trim();
        // Tarkistaa onko syöte sopivan pituinen
        if (taskText.length < 3) {
            alert("Tehtävän tulee olla vähintään 3 merkkiä pitkä.");
            return;
        }
        
        const task = {
            id: Date.now(), // tunniste tehtävälle
            text: taskText,
            completed: false
        };

        saveTask(task); // Tallentaa tehtävän localStorageen
        renderTask(task); // Lisää tehtävän näkyviin listaan
        taskInput.value = ""; // Tyhjentää syöttökentän
    }

    function saveTask(task) {
        const tasks = getTasks(); // Hakee tallennetut tehtävät
        tasks.push(task); // Lisää uuden tehtävän listaan
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Tallentaa localstorageen
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || []; // Palauttaa tallennetut tehtävät tai tyhjän listan
    }

    function loadTasks() {
        taskList.innerHTML = ""; // Tyhjentää listan
        getTasks().forEach(renderTask); // Lisää tallennetut tehtävät näkyviin
    }

    function renderTask(task) {
        const li = document.createElement("li");
        li.dataset.id = task.id; // Asettaa tehtävän tunnisteen
        li.className = task.completed ? "completed" : ""; // Lisää CSS-luokan, jos tehtävä on valmis
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="complete">✔</button>
            <button class="delete">✖</button>
        `;
        taskList.appendChild(li);
    }

    function handleTaskClick(event) {
        if (event.target.classList.contains("complete")) {
            toggleTask(event.target.parentElement.dataset.id); // Merkitsee tehtävän valmiiksi tai aktiiviseksi
        } else if (event.target.classList.contains("delete")) {
            deleteTask(event.target.parentElement.dataset.id); // Poistaa tehtävän
        }
    }

    function toggleTask(taskId) {
        const tasks = getTasks().map(task => {
            if (task.id == taskId) {
                task.completed = !task.completed; // Vaihtaa tehtävän tilan
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Päivittää localStoragen
        loadTasks(); // Päivittää listan
    }

    function deleteTask(taskId) {
        const tasks = getTasks().filter(task => task.id != taskId); // Poistaa tehtävän listasta
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Tallentaa päivitetyn listan
        loadTasks(); // Päivittää listan näkyviin
    }

    function filterTasks() {
        const filter = filterOptions.value; // Hakee suodatuksen arvon
        document.querySelectorAll("#taskList li").forEach(li => {
            switch (filter) {
                case "all":
                    li.style.display = ""; // Näyttää kaikki tehtävät
                    break;
                case "active":
                    li.style.display = li.classList.contains("completed") ? "none" : ""; // Näyttää vain aktiiviset tehtävät
                    break;
                case "completed":
                    li.style.display = li.classList.contains("completed") ? "" : "none"; // Näyttää vain valmiit tehtävät
                    break;
            }
        });
    }
});