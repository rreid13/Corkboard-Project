let calendarEditMode = false;
let allCalendarEvents = [];
let currentCalendarDate = "";

async function buildCalendar() {

    /*
     * Get events
     */

    const response =
        await fetch("JSONfiles/events.json");

    const events =
        await response.json();

    allCalendarEvents = events;


    /*
     * Today's date
     */

    var today = new Date();

    var year =
        today.getFullYear();

    var month =
        today.getMonth();

    var todayDate =
        today.getDate();


    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /*
     * First day of month
     */

    var firstDayOfMonth =
        new Date(
            year,
            month,
            1
        );

    var startDayOfWeek =
        firstDayOfMonth.getDay();


    /*
     * Monday = first day of week
     */

    var startOffset =
        startDayOfWeek - 1;


    if (startDayOfWeek === 0) {

        startOffset = 6;

    }


    /*
     * Number of days in month
     */

    var daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /*
     * Calendar heading
     */

    var html =
        `<div class="calendarHeading">
            ${monthNames[month]} ${year}
        </div>`;


    html +=
        `<div class="calendarGrid">`;


    /*
     * Day letters
     */

    var dayLetters = [
        "M",
        "T",
        "W",
        "T",
        "F",
        "S",
        "S"
    ];


    dayLetters.forEach(letter => {

        html +=
            `<div class="dayLetter">
                ${letter}
            </div>`;

    });


    /*
     * Empty spaces before
     * the first day
     */

    for (
        var i = 0;
        i < startOffset;
        i++
    ) {

        html +=
            `<div class="calendarDay empty"></div>`;

    }


    /*
     * Create each day
     */

    for (
        var dayNum = 1;
        dayNum <= daysInMonth;
        dayNum++
    ) {


        /*
         * Create date string
         *
         * Example:
         * 2026-09-15
         */

        var dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;


        /*
         * Find events on this date
         */

        const dayEvents =
            events.filter(event => {

                if (event.date === dateString) {
                    return true;
                }

                const dayEvents =
                    events.filter(event =>
                        event.date === dateString
                    );

                return false;

            });


        /*
         * Create event dots
         */

        var dotsHTML = "";


        dayEvents.forEach(event => {

            dotsHTML +=
                `<span
                    class="eventDot ${event.type}"
                ></span>`;

        });


        /*
         * Today class
         */

        var todayClass =
            dayNum === todayDate
                ? "calendarDay today"
                : "calendarDay";


        /*
         * Create calendar day
         */

        html +=
            `<div
                class="${todayClass}"
                data-date="${dateString}"
            >

                <span class="dayNumber">
                    ${dayNum}
                </span>

                <div class="eventDots">
                    ${dotsHTML}
                </div>

            </div>`;

    }


    html += `</div>`;


    /*
     * Put calendar onto page
     */

    document.getElementById(
        "calendarText"
    ).innerHTML = html;

    /*
 * Make calendar dates clickable
 */

    document
        .querySelectorAll(".calendarDay[data-date]")
        .forEach(day => {

            day.addEventListener("click", function () {

                const selectedDate =
                    this.dataset.date;

                displayCalendarEvents(
                    selectedDate,
                    events
                );

            });

        });

}

function displayCalendarEvents(selectedDate, events) {
    currentCalendarDate = selectedDate;

    const calendarEvents =
        document.getElementById("calendarEvents");

    const calendarEventList =
        document.getElementById("calendarEventList");

    const selectedEvents =
        events.filter(event =>
            event.date === selectedDate
        );

    const date = new Date(selectedDate + "T00:00:00");

    const dateText = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long"
    });


    let html = `
    <div class="calendarEventHeading">
        ${dateText}
    </div>
`;


    selectedEvents.forEach(event => {

        let timeText = "ALL DAY";

        if (!event.allDay) {
            timeText =
                `${formatEventTime(event.startTime)} – ${formatEventTime(event.endTime)}`;
        }


        html += `
        <div class="calendarEvent">

            <div class="calendarEventName">
                <span class="eventDot ${event.type}"></span>
                ${event.name}

                ${calendarEditMode
                ? `<button
                        class="calendarEditEventButton"
                        onclick="editCalendarEvent(${allCalendarEvents.indexOf(event)})"
                    >✎</button>`
                : ""
            }

            </div>

            <div class="calendarEventTime">
                ${timeText}
            </div>

        </div>
    `;
    });


    html += `
    <button class="calendarBackButton" onclick="hideCalendarEvents()">
        ← Back
    </button>
`;


    if (calendarEditMode) {

        html += `
        <button
            class="calendarAddButton"
            onclick="addCalendarEvent()"
        >
            Add Event
        </button>
    `;

    }


    calendarEventList.innerHTML = html;
    calendarEvents.classList.remove("editing", "adding");

    document
        .getElementById("calendarView")
        .classList.add("showEvents");
}

function hideCalendarEvents() {

    document
        .getElementById("calendarView")
        .classList.remove("showEvents");
}

function formatEventTime(time) {

    if (!time) {
        return "";
    }


    const [hours, minutes] =
        time.split(":");


    const date =
        new Date();


    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );


    return date.toLocaleTimeString(
        [],
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );

}


buildCalendar();


document.getElementById("calendarPen").addEventListener("click", function () {

    calendarEditMode = !calendarEditMode;

    this.classList.toggle("editing", calendarEditMode);

    document
        .getElementById("calendarView")
        .classList.toggle("editing", calendarEditMode);


});

function editCalendarEvent(eventIndex) {

    const event = allCalendarEvents[eventIndex];

    const calendarEvents =
        document.getElementById("calendarEvents");

    const calendarEditForm =
        document.getElementById("calendarEditForm");


    calendarEditForm.innerHTML = `

        <input
            type="text"
            id="editEventName"
            class="calendarEditHeading"
            value="${event.name}"
        >


        <div class="calendarEditForm">

            <div class="editField">

                <label>
                    Date
                </label>

                <input
                    type="date"
                    id="editEventDate"
                    value="${event.date}"
                >

            </div>


            <div class="editField">

                <label>
                    Category
                </label>

                <select id="editEventType">

                    <option value="personal" ${event.type === "personal" ? "selected" : ""}>
                        Personal
                    </option>

                    <option value="university" ${event.type === "university" ? "selected" : ""}>
                        University
                    </option>

                    <option value="work" ${event.type === "work" ? "selected" : ""}>
                        Work
                    </option>

                    <option value="birthday" ${event.type === "birthday" ? "selected" : ""}>
                        Birthday
                    </option>

                    <option value="other" ${event.type === "other" ? "selected" : ""}>
                        Other
                    </option>

                </select>

            </div>


            <div class="editField">

                <label>
                    Start
                </label>

                <input
                    type="time"
                    id="editEventStart"
                    value="${event.startTime}"
                >

            </div>


            <div class="editField">

                <label>
                    Finish
                </label>

                <input
                    type="time"
                    id="editEventEnd"
                    value="${event.endTime}"
                >

            </div>


            <label class="allDayLabel">

                <input
                    type="checkbox"
                    id="editEventAllDay"
                    ${event.allDay ? "checked" : ""}
                >

                All Day

            </label>

        </div>


        <div class="calendarEditButtons">

            <button
                class="calendarDeleteButton"
                onclick="deleteCalendarEvent(${eventIndex})"
            >
                Delete
            </button>


            <div class="calendarRightButtons">

                <button
                    class="calendarCancelButton"
                    onclick="displayCalendarEventsAgain()"
                >
                    Cancel
                </button>


                <button
                    class="calendarSaveButton"
                    onclick="saveCalendarEvent(${eventIndex})"
                >
                    Save
                </button>

            </div>

        </div>

    `;


    calendarEvents.classList.add("editing");

    const nameInput =
        document.getElementById("editEventName");

    nameInput.focus();
    nameInput.select();

}

function addCalendarEvent() {

    const calendarEvents =
        document.getElementById("calendarEvents");

    const calendarAddForm =
        document.getElementById("calendarAddForm");


    calendarAddForm.innerHTML = `

        <input
            type="text"
            id="addEventName"
            class="calendarEditHeading"
            value="New Event"
        >


        <div class="calendarEditForm">

            <div class="editField">

                <label>
                    Date
                </label>

                <input
                    type="date"
                    id="addEventDate"
                    value="${currentCalendarDate}"
                >

            </div>


            <div class="editField">

                <label>
                    Category
                </label>

                <select id="addEventType">

                    <option value="personal">
                        Personal
                    </option>

                    <option value="university">
                        University
                    </option>

                    <option value="work">
                        Work
                    </option>

                    <option value="birthday">
                        Birthday
                    </option>

                    <option value="other">
                        Other
                    </option>

                </select>

            </div>


            <div class="editField">

                <label>
                    Start
                </label>

                <input
                    type="time"
                    id="addEventStart"
                >

            </div>


            <div class="editField">

                <label>
                    Finish
                </label>

                <input
                    type="time"
                    id="addEventEnd"
                >

            </div>


            <label class="allDayLabel">

                <input
                    type="checkbox"
                    id="addEventAllDay"
                >

                All Day

            </label>

        </div>


        <div class="calendarEditButtons">

            <button
                class="calendarAddEventCancelButton"
                onclick="displayCalendarEventsAgain()"
            >
                Cancel
            </button>


            <button
                class="calendarAddEventButton"
                onclick="saveNewCalendarEvent()"
            >
                Add
            </button>

        </div>

    `;


    const nameInput =
        document.getElementById("addEventName");


    nameInput.focus();

    nameInput.select();


    calendarEvents.classList.add("adding");

}

async function saveNewCalendarEvent() {

    const startTime =
        document.getElementById("addEventStart").value;

    const endTime =
        document.getElementById("addEventEnd").value;

    const allDay =
        !startTime || !endTime;

    const newEvent = {

        date:
            document.getElementById("addEventDate").value,

        name:
            document.getElementById("addEventName").value,

        startTime:
            allDay ? "" : startTime,

        endTime:
            allDay ? "" : endTime,

        allDay:
            allDay,

        type:
            document.getElementById("addEventType").value

    };


    try {

        const response = await fetch(
            "/api/events",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(newEvent)
            }
        );


        if (!response.ok) {
            throw new Error("Failed to add event");
        }


        await response.json();


        await buildCalendar();


        displayCalendarEvents(
            newEvent.date,
            allCalendarEvents
        );


    } catch (error) {

        console.error(error);

        alert("Could not add event.");

    }

}



function displayCalendarEventsAgain() {

    displayCalendarEvents(
        currentCalendarDate,
        allCalendarEvents
    );

}

async function saveCalendarEvent(eventIndex) {

    const originalEvent =
        allCalendarEvents[eventIndex];


    const updatedEvent = {
        ...originalEvent,

        name:
            document.getElementById("editEventName").value,

        date:
            document.getElementById("editEventDate").value,

        startTime:
            document.getElementById("editEventStart").value,

        endTime:
            document.getElementById("editEventEnd").value,

        allDay:
            document.getElementById("editEventAllDay").checked,

        type:
            document.getElementById("editEventType").value
    };


    try {

        const response = await fetch(
            `/api/events/${eventIndex}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedEvent)
            }
        );


        if (!response.ok) {
            throw new Error("Failed to save event");
        }


        await response.json();


        await buildCalendar();

        displayCalendarEvents(
            currentCalendarDate,
            allCalendarEvents
        );


    } catch (error) {

        console.error(error);

        alert("Could not save event.");

    }

}

async function deleteCalendarEvent(eventIndex) {

    const event = allCalendarEvents[eventIndex];

    const confirmed =
        confirm(`Delete "${event.name}"?`);


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `/api/events/${eventIndex}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete event");
        }


        await response.json();


        await buildCalendar();

        displayCalendarEvents(
            currentCalendarDate,
            allCalendarEvents
        );

    } catch (error) {

        console.error(error);

        alert("Could not delete event.");

    }

}