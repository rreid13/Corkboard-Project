
console.log("reminders.js loaded");

const reminderList = document.getElementById("reminderList");
const remindersPen = document.getElementById("remindersPen");
const editingRemindersText = document.getElementById("editingRemindersText");
let editRemindersMode = false;

//LOAD REMINDERS

async function loadReminders() {
    const response = await fetch("/api/reminders");
    const data = await response.json();

    let html = "";

    data.reminders.forEach(reminder => {
        html += `
        <div class="reminder" onclick="deleteReminder('${reminder}')">• ${reminder}</div>
        `;
    });

    reminderList.innerHTML = html;

    if (editRemindersMode) {
        showAddReminder();
    }
}

loadReminders();

// DELETE REMINDER

async function deleteReminder(reminder) {

    await fetch("/api/reminders", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reminder: reminder
        })
    });

    location.reload(
    )
}

remindersPen.addEventListener("click", function () {
    editRemindersMode = !editRemindersMode;

    if (editRemindersMode) {
        remindersPen.classList.add("edit-mode");
        editingRemindersText.classList.add("visible");

        showAddReminder();
    } else {
        remindersPen.classList.remove("edit-mode");
         editingRemindersText.classList.remove("visible");

        hideAddReminder();
    }
});

//SHOW ADD REMINDER

function showAddReminder() {

    if (document.getElementById("addReminder")) {
        return;
    }

    const addReminder = document.createElement("div");
    addReminder.id = "addReminder";
    addReminder.textContent = "Add Reminder";

    reminderList.appendChild(addReminder);

    addReminder.addEventListener("click", function () {
        hideAddReminder();
        createReminderInput();
    });
}

//HIDE ADD REMINDER

function hideAddReminder() {
    const addReminder = document.getElementById("addReminder");
    if (addReminder) {
        addReminder.remove();
    }
    const reminderInput = document.getElementById("newReminderInput");
    if (reminderInput) {
        reminderInput.remove();
    }
}

//CREATE INPUT

function createReminderInput() {
    if (document.getElementById("newReminderInput")) {
        return;
    }

    const reminderInput = document.createElement("input");
    reminderInput.id = "newReminderInput";
    reminderInput.type = "text";
    reminderInput.placeholder = "Enter reminder...";

    reminderList.appendChild(reminderInput);

    reminderInput.focus();

    reminderInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            console.log("Enter key pressed");
            const newReminder = reminderInput.value.trim();
            console.log("New reminder:", newReminder);
            if (newReminder !== "") {
                addReminder(newReminder);
            }
        }
    });
}

//ADD REMINDER

async function addReminder(reminder) {
    console.log("Adding reminder:", reminder);
    await fetch("/api/reminders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reminder: reminder
        })
    });

    loadReminders();
}