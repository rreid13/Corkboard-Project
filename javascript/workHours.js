const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];

let workHoursData = null;


function getMondayDate() {

    var today = new Date();
    var dayOfWeek = today.getDay();

    var daysSinceMonday = dayOfWeek - 1;

    if (dayOfWeek === 0) {
        daysSinceMonday = 6;
    }

    var monday = new Date(today);

    monday.setDate(
        today.getDate() - daysSinceMonday
    );

    var day = monday.getDate();
    var month = monday.getMonth() + 1;
    var year = monday.getFullYear();

    return day + "/" + month + "/" + year;
}


function displayWorkHours(data) {

    let html =
        `<div class="weekHeading">
            Week beginning ${getMondayDate()}
        </div>`;

    let totalHours = 0;


    days.forEach(day => {

        const hours = data[day];


        if (hours === null) {

            html += `
                <div class="workDay dayOff">
                    <span>${day.toUpperCase()}</span>
                    <span>DAY OFF</span>
                </div>
            `;

        }

        else {

            let startPeriod = "AM";
            let startDisplay = hours.start;

            if (hours.start >= 12) {
                startPeriod = "PM";
            }

            if (hours.start > 12) {
                startDisplay = hours.start - 12;
            }


            let endPeriod = "AM";
            let endDisplay = hours.end;

            if (hours.end >= 12) {
                endPeriod = "PM";
            }

            if (hours.end > 12) {
                endDisplay = hours.end - 12;
            }


            html += `
                <div class="workDay">
                    <span>${day.toUpperCase()}</span>
                    <span>
                        ${startDisplay}${startPeriod} -
                        ${endDisplay}${endPeriod}
                    </span>
                </div>
            `;

            totalHours += hours.end - hours.start;
        }

    });


    html += `<br>`;
    html += `<br>`;


    html += `
        <div class="totals">
            <span>Total Hours</span>
            <span>${totalHours}</span>
        </div>

        <div class="totals">
            <span>Hourly Pay</span>
            <span>€${data.hourlyPay}</span>
        </div>

        <div class="finaltotal">
            <span>Total</span>
            <span>€${totalHours * data.hourlyPay}</span>
        </div>
    `;


    document.getElementById("workHoursText").innerHTML = html;
}


function openWorkHoursEditor() {

    const container =
        document.getElementById("workHoursEdit");

    let html = "";


    days.forEach(day => {

        const hours = workHoursData[day];

        const isDayOff = hours === null;

        const startValue =
            isDayOff ? 9 : hours.start;

        const endValue =
            isDayOff ? 17 : hours.end;


        html += `
            <div class="editWorkDay">

                <div class="editWorkDayTitle">
                    ${day.toUpperCase()}
                </div>

                <div class="editWorkRow">

                    <select
                        class="workTimeSelect"
                        id="${day}Start"
                        ${isDayOff ? "disabled" : ""}
                    >
                        ${createTimeOptions(startValue)}
                    </select>

                    <span>→</span>

                    <select
                        class="workTimeSelect"
                        id="${day}End"
                        ${isDayOff ? "disabled" : ""}
                    >
                        ${createTimeOptions(endValue)}
                    </select>

                </div>

                <label class="dayOffLabel">

                    <input
                        type="checkbox"
                        class="dayOffCheckbox"
                        id="${day}DayOff"
                        ${isDayOff ? "checked" : ""}
                    >

                    Day off

                </label>

            </div>
        `;
    });


    html += `
        <button id="saveWorkHours">
            DONE
        </button>
    `;


    container.innerHTML = html;


    document.getElementById("workHoursText")
        .style.opacity = "0";

    container.classList.add("open");


    addDayOffListeners();


    document
        .getElementById("saveWorkHours")
        .addEventListener("click", saveWorkHours);
}


function createTimeOptions(selectedTime) {

    let html = "";

    for (let hour = 0; hour <= 23; hour++) {

        const label = formatTime(hour);

        html += `
            <option
                value="${hour}"
                ${hour === selectedTime ? "selected" : ""}
            >
                ${label}
            </option>
        `;
    }

    return html;
}


function formatTime(hour) {

    if (hour === 0) {
        return "12AM";
    }

    if (hour === 12) {
        return "12PM";
    }

    if (hour > 12) {
        return `${hour - 12}PM`;
    }

    return `${hour}AM`;
}


function addDayOffListeners() {

    days.forEach(day => {

        const checkbox =
            document.getElementById(`${day}DayOff`);

        const start =
            document.getElementById(`${day}Start`);

        const end =
            document.getElementById(`${day}End`);


        checkbox.addEventListener("change", function () {

            start.disabled = this.checked;
            end.disabled = this.checked;

        });

    });
}


async function saveWorkHours() {

    const updatedData = {
        hourlyPay: workHoursData.hourlyPay
    };


    days.forEach(day => {

        const dayOff =
            document.getElementById(`${day}DayOff`).checked;


        if (dayOff) {

            updatedData[day] = null;

        }

        else {

            const start =
                Number(
                    document.getElementById(`${day}Start`).value
                );

            const end =
                Number(
                    document.getElementById(`${day}End`).value
                );


            updatedData[day] = {
                start: start,
                end: end
            };
        }

    });


    const response = await fetch("/api/workHours", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedData)

    });


    if (!response.ok) {

        console.error("Failed to save work hours");

        return;
    }


    workHoursData = updatedData;


    displayWorkHours(workHoursData);


    document
        .getElementById("workHoursEdit")
        .classList.remove("open");

    document
        .getElementById("workHoursText")
        .style.opacity = "1";
}


/* Load work hours */

fetch("JSONfiles/workHours.json")
    .then(response => response.json())
    .then(data => {

        workHoursData = data;

        displayWorkHours(data);

    });

document.addEventListener("DOMContentLoaded", function () {

    const workPen = document.getElementById("workPen");

    workPen.addEventListener("click", function () {

        openWorkHoursEditor();

    });

});