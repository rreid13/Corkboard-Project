const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

const PORT = 3000;

function getWeatherCondition(code) {

    if (code === 0) {
        return "Sunny";
    }

    if (code === 1) {
        return "Sunny";
    }

    if (code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Fog";
    }

    if (code >= 51 && code <= 57) {
        return "Light Rain";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain";
    }

    if (code === 85 || code === 86) {
        return "Snow";
    }

    if (code === 95) {
        return "Lightning";
    }

    if (code === 96 || code === 99) {
        return "Hail";
    }

    return "Cloudy";
}

function getWeatherConditionForTime(code, isDay) {

    if (code === 0 || code === 1) {

        if (isDay === 0) {
            return "Clear";
        }

        return "Sunny";
    }


    if (code === 2) {

        if (isDay === 0) {
            return "Partly Clear";
        }

        return "Partly Cloudy";
    }


    return getWeatherCondition(code);
}


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

    const LAT = req.query.lat;
    const LON = req.query.lon;

    const url =
        `https://erddap.marine.ie/erddap/tabledap/` +
        `IMI_TidePrediction_HighLow.json` +
        `?stationID,time,tide_time_category,Water_Level_ODMalin` +
        `&stationID="Buncranna"` +
        `&time>=now-1day` +
        `&time<=now%2B2%20days`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Marine Institute returned ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Marine Institute tide data:", data);

        res.json(data);

    } catch (error) {

        console.error("Tide API error:", error);

        res.status(500).json({
            error: "Failed to fetch tide data",
            details: error.message
        });

    }

});

app.get("/api/weather", async (req, res) => {

    const LAT = req.query.lat;
    const LON = req.query.lon;

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}` +
        `&longitude=${LON}` +
        `&current=temperature_2m,weather_code,is_day` +
        `&hourly=temperature_2m,weather_code,is_day` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
        `&timezone=Europe%2FLondon` +
        `&forecast_days=7`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Open-Meteo returned ${response.status}`);
        }

        const data = await response.json();


        // CURRENT WEATHER

        const current = {
            condition: getWeatherConditionForTime(
                data.current.weather_code,
                data.current.is_day
            ),

            temperature: Math.round(data.current.temperature_2m)
        };


        // TODAY

        const today = {
            high: Math.round(data.daily.temperature_2m_max[0]),
            low: Math.round(data.daily.temperature_2m_min[0])
        };


        // HOURLY WEATHER

        const hourly = [];

        const currentTime = new Date();

        const currentHour = currentTime.getHours();

        for (let i = 0; i < 12; i++) {

            const index = currentHour + i;

            hourly.push({
                condition: getWeatherConditionForTime(
                    data.hourly.weather_code[index],
                    data.hourly.is_day[index]
                ),

                temperature: Math.round(data.hourly.temperature_2m[index])
            });

        }


        // DAILY WEATHER

        const daily = [];

        for (let i = 0; i < 7; i++) {

            daily.push({
                condition: getWeatherCondition(
                    data.daily.weather_code[i]
                ),

                low: Math.round(data.daily.temperature_2m_min[i]),
                high: Math.round(data.daily.temperature_2m_max[i])
            });

        }


        // SEND DATA TO FRONTEND

        res.json({
            current,
            today,
            hourly,
            daily
        });

    } catch (error) {

        console.error("Weather API error:", error);

        res.status(500).json({
            error: "Failed to fetch weather data"
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/api/workHours", (req, res) => {

    try {

        const filePath =
            path.join(__dirname, "../JSONfiles/workHours.json");


        fs.writeFileSync(
            filePath,
            JSON.stringify(req.body, null, 4)
        );


        res.json({
            message: "Work hours saved"
        });

    }

    catch (error) {

        console.error("Error saving work hours:", error);

        res.status(500).json({
            error: "Failed to save work hours"
        });
    }

});