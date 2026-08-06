
console.log("reminders.js loaded");

fetch("/api/reminders")
    .then(response => response.json())
    .then(data => {

        const reminderList = document.getElementById("reminderList");

        let html = "";

        data.reminders.forEach(reminder => {
            html += `<div class="reminder" onclick="deleteReminder('${reminder}')">• ${reminder}</div>`;
        });

        reminderList.innerHTML = html;

    })
    .catch(error => console.error(error));

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