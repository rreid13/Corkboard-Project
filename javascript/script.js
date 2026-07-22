fetch("JSONfiles/reminders.json")
    .then(response => response.json())
    .then(data => {

        const reminderList = document.getElementById("reminderList");

        let html = "";

        data.reminders.forEach(reminder => {
            html += `<div class="reminder">• ${reminder}</div>`;
        });

        reminderList.innerHTML = html;

    })
    .catch(error => console.error(error));