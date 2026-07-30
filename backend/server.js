require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();

const PORT = 3000;

app.get("/api/tides", async (req, res) => {

    const url = `https://www.worldtides.info/api/v3?heights=0&extremes=1&lat=YOUR_LAT&lon=YOUR_LON&key=${process.env.WORLDTIDES_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});