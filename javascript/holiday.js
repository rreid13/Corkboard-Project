const API_KEY = "MQEVZxMXGwSFOnN1YfGO4r3YAGdCts3R";

fetch("https://api.apilayer.com/checkiday/events", {
    headers: {
        "apikey": API_KEY
    }
})

    .then(response => response.json())
    .then(data => {


        const holiday = document.getElementById("stickyNoteText");

        const randomIndex = Math.floor(Math.random() * data.events.length);

        holiday.innerText = "Today is " + data.events[randomIndex].name + "!";

    })
    .catch(error => {
        console.error(error);
    });