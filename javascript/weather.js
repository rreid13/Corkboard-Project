console.log("weather.js loaded");

const WEATHER_TEST_DATA = true;

async function getWeather() {
    let weather;

    if (WEATHER_TEST_DATA) {
        weather = {
            condition: "Sunny",
            high: 20,
            low: 12
        };
    } else {
        const response = await fetch("/api/weather");
        weather = await response.json();
    }

    console.log(weather);
    displayWeather(weather);
}

function displayWeather(weather) {
    const html = `
    ${weather.low}°C → ${weather.high}°C
    `
    document.getElementById("weatherText").innerHTML = html;
}

getWeather();

/*
function changeWeatherAnimation(condition) {

    if (condition === "Sunny") {
        showSunAnimation();
    }

    if (condition === "Rain") {
        showRainAnimation();
    }

}
    */