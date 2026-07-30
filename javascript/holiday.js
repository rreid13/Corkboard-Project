console.log("holiday.js loaded");

fetch("https://api.apilayer.com/checkiday/events", {
    headers: {
        apikey: CHECKIDAY_API_KEY
    }
})
.then(response => response.json())
.then(data => {

    console.log(data);

    if (!data.events) {
        console.error("No events returned.");
        return;
    }

    const holiday = document.getElementById("stickyNoteText");

    const randomIndex =
        Math.floor(Math.random() * data.events.length);

    holiday.innerText =
        "Today is " + data.events[randomIndex].name + "!";

})
.catch(console.error);