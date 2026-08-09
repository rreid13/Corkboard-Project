const fs = require("fs");
const path = require("path");

require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();

const PORT = 3000;


app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));

app.get("/api/reminders", (req, res) => {
    const filePath = path.join(__dirname, "../JSONfiles/reminders.json");

    const data = fs.readFileSync(filePath);
    res.json(JSON.parse(data));
});

app.delete("/api/reminders", (req, res) => {

    const filePath = path.join(__dirname, "../JSONfiles/reminders.json");

    const data = JSON.parse(fs.readFileSync(filePath));

    const reminderToDelete = req.body.reminder;

    data.reminders = data.reminders.filter(
        reminder => reminder !== reminderToDelete
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2)
    );

    res.json({
        message: "Reminder deleted"
    });

});

app.post("/api/reminders", (req, res) => {

console.log("POST /api/reminders received");
    console.log("Reminder:", req.body.reminder);

    const filePath = path.join(__dirname, "../JSONfiles/reminders.json");

    const data = JSON.parse(fs.readFileSync(filePath));

    const newReminder = req.body.reminder;

    data.reminders.push(newReminder);

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2)
    );

    res.json({
        message: "Reminder added"
    });

});

app.get("/api/tides", async (req, res) => {

    const url = `https://www.worldtides.info/api/v3?heights=0&extremes=1&lat=YOUR_LAT&lon=YOUR_LON&key=${process.env.WORLDTIDES_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});