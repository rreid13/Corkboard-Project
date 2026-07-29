function getMondayDate() {
    var today = new Date();
    var dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    var daysSinceMonday = dayOfWeek - 1;
    if (dayOfWeek === 0) {
        daysSinceMonday = 6; // if today is Sunday, Monday was 6 days ago
    }

    var monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);

    var day = monday.getDate();
    var month = monday.getMonth() + 1; // getMonth() is 0-indexed, so January = 0
    var year = monday.getFullYear();

    return day + "/" + month + "/" + year;
};

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


fetch("JSONfiles/workHours.json")
    .then(response => response.json())
    .then(data => {

        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ];

        let html = `<div class="weekHeading">Week beginning ${getMondayDate()}</div>`;
        let totalHours = 0;

        days.forEach(day => {

            const hours = data[day];

            if (data[day] === null) {
                html += `<div class="workDay">
                    <span>${day.toUpperCase()}</span>
                    <span>DAY OFF</span>
                </div>`;
            }

            else {
                var startPeriod = "AM";
                var startDisplay = data[day].start;

                if (data[day].start >= 12) {
                    startPeriod = "PM";
                }

                if (data[day].start > 12) {
                    startDisplay = data[day].start - 12;
                }

                var endPeriod = "AM";
                var endDisplay = data[day].end;

                if (data[day].end >= 12) {
                    endPeriod = "PM";
                }

                if (data[day].end > 12) {
                    endDisplay = data[day].end - 12;
                }

                html += `<div class="workDay">
                    <span>${day.toUpperCase()}</span>
                    <span>${startDisplay}${startPeriod} - ${endDisplay}${endPeriod}</span>
                </div>`;

                totalHours += data[day].end - data[day].start;
            }

        });

        html += `<br>`;
        html += `<br>`;
        html += `<div class="totals"><span>Total Hours</span><span>${totalHours}</span></div>`;
        html += `<div class="totals"><span>Hourly Pay</span><span>€${data.hourlyPay}</span></div>`;
        html += `<div class="finaltotal"><span>Total</span><span>€${totalHours * data.hourlyPay}</span></div>`;
        document.getElementById("workHoursText").innerHTML = html;

    });