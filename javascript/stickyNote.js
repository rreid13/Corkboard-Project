async function displayHoliday() {

    const response = await fetch("JSONfiles/holidays.json");
    const holidays = await response.json();

    const today = new Date();

    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${month}-${day}`;

    const todaysHolidays = holidays.filter(holiday => {
        return holiday.date === todayDate;
    });

    if (todaysHolidays.length === 0) {
        document.getElementById("stickyNoteText").textContent = "No special day today!";
        return;
    }

    // Pick one holiday at random
    const randomHoliday =
        todaysHolidays[Math.floor(Math.random() * todaysHolidays.length)];

    document.getElementById("stickyNoteText").textContent =
        "Today is " + randomHoliday.name;
}

displayHoliday();