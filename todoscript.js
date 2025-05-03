const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
//inputBox: references the input field where users type a task.
//listContainer: references the container (<ul> ) where tasks will be listed.

function addTask() {
  const taskText = inputBox.value.trim();//Gets the user input, trims whitespace from both ends.
  if (taskText === '') {
    alert("CAN NOT ADD AN EMPTY TASK!");
    return;
  }

  const li = document.createElement("li"); //Creates a new list item element.
  const timestamp = new Date().toLocaleString(); //Gets the current date and time
  
  const spanText = document.createElement("span");
  spanText.className= "task-text";
  spanText.textContent = taskText;
  li.appendChild(spanText); //Creates a span for the task text, sets the content, and adds it to the <li>.

  const small = document.createElement("small");
  small.className = "timestamp";
  small.textContent = `Added on ${timestamp}`;
  li.appendChild(small);//Creates a timestamp <small> element and appends it.

const edit = document.createElement("span");
edit.innerHTML = "✏️";
edit.className = "edit-btn";
li.appendChild(edit);

// const newTimestamp = new Date().toLocaleString();
// small.textContent = `Edited on ${newTimestamp}`;
const confirm = document.createElement("span");
confirm.innerHTML = "✔️";
confirm.className = "confirm-btn";
confirm.style.display = "none";

li.appendChild(confirm);


  const del = document.createElement("span");
  del.textContent = "\u00d7";
  del.className = "delete-btn";
  li.appendChild(del); //Adds a delete button (a red X) using the Unicode character ×.

  listContainer.appendChild(li);
  inputBox.value = "";
  saveData(); //Appends the new task to the list, clears the input field, and saves the updated list.


}
//Adds an event listener to detect clicks within the list.
listContainer.addEventListener("click", function(e) {
const li = e.target.closest("li"); // Safely get the <li> container

if (!li) return; // Prevents error if clicked outside a task

if (
  e.target.tagName === "LI" || 
  (e.target.tagName === "SPAN" && 
   !e.target.classList.contains("delete-btn") && 
   !e.target.classList.contains("edit-btn") && 
   !e.target.classList.contains("confirm-btn"))
) {
  li.classList.toggle("checked");
  /* This block marks/unmarks a task as completed.

It checks if the user clicked:

directly on a <li> element (the task item), or

on a <span> inside the list item, but not on a delete, edit, or confirm button.

li.classList.toggle("checked") adds or removes the checked class, which visually indicates completion (e.g., strike-through). */
} 
else if (e.target.classList.contains("delete-btn")) {
  li.remove();
  //If the user clicks a delete button (span with class delete-btn), the entire task (li) is removed from the DOM.


} 
else if (e.target.classList.contains("edit-btn")) {
  if (listContainer.querySelector("input.task-edit")) {
    alert("Finish editing the current task first.");
    return;
    /**Begins editing a task.

It prevents editing multiple tasks at once by checking if an input field with class task-edit already exists. */
  }

  const span = li.querySelector(".task-text");
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.className = "task-edit";
  li.insertBefore(input, span);
  span.style.display = "none";

  li.querySelector(".edit-btn").style.display = "none";
  li.querySelector(".confirm-btn").style.display = "inline-block";
  /*Converts the task's text span into an editable input field and then hides the original text and "Edit" button.
And shows the "Confirm" button to allow the user to finish editing.*/


} 
else if (e.target.classList.contains("confirm-btn")) {
  const input = li.querySelector("input.task-edit");
  const span = li.querySelector(".task-text"); //This block runs when the user clicks the "Confirm" button after editing.
  if (input && input.value.trim() !== "") {
    span.textContent = input.value.trim();
    span.style.display = "inline";
    input.remove();
    // Updates the timestamp
const timestampElement = li.querySelector(".timestamp");
const newTimestamp = new Date().toLocaleString();
timestampElement.textContent = `Edited on ${newTimestamp}`;

    li.querySelector(".edit-btn").style.display = "inline-block";
    li.querySelector(".confirm-btn").style.display = "none";
    saveData();
  } else {
    alert("Task cannot be empty!");
  }
}

saveData();
});



function clearAll() {
  listContainer.innerHTML = "";
  saveData(); //Removes all tasks from the DOM and storage.


}

function clearCompleted() {
  const tasks = listContainer.querySelectorAll("li.checked");
  tasks.forEach(task => task.remove());
  saveData();
} //Selects all tasks with class checked (ie. the completed ones) and it deletes them.

function saveData() {
  localStorage.setItem("tasks", listContainer.innerHTML);
} //This stores the current task list's HTML in the browser's localStorage.

function showTask() {
  listContainer.innerHTML = localStorage.getItem("tasks") || "";
}
//This Loads tasks from the localStorage into the DOM when the page loads.

showTask();
//This immediately calls showTask() when the script loads to restore tasks.

function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('todo-theme', theme);
    /**Changes the current theme by setting the <body>'s class.

    Also saves the selected theme to localStorage. */
  }
  
  function applySavedTheme() {
    const savedTheme = localStorage.getItem('todo-theme') || 'light';
    setTheme(savedTheme);
  }
  /**On page load, it applies the saved theme if it exists.

Defaults to 'light' if no theme is saved.

 */
  applySavedTheme();
  