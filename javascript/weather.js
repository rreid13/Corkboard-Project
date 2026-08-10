console.log("weather.js loaded");

const WEATHER_TEST_DATA = true;

async function getWeather() {
    let weather;

    if (WEATHER_TEST_DATA) {
        weather = {
            current: {
                condition: "Sunny",
                temperature: 18
            },

            today: {
                high: 20,
                low: 12
            }
        };
    } else {
        const response = await fetch("/api/weather");
        weather = await response.json();
    }

    console.log(weather);
   displayWeather(weather);
    displayCurrentWeather(weather);
}

function displayWeather(weather) {
    const html = `
    ${weather.today.low}°C → ${weather.today.high}°C
    `
    document.getElementById("weatherText").innerHTML = html;
}

getWeather();

const foldedWeatherIcon = document.getElementById("foldedWeatherIcon");
const weatherExpanded = document.getElementById("weatherExpanded");

foldedWeatherIcon.addEventListener("click", function () {
    weatherExpanded.classList.toggle("open");
    document.getElementById("foldedCardFront").classList.toggle("hidden");
    document.getElementById("sunnySea").classList.toggle("hidden");
    document.getElementById("tideText").classList.toggle("hidden");
    document.getElementById("weatherText").classList.toggle("hidden");
});

function displayCurrentWeather(weather) {
    const largeIcons = {
        "Sunny": "sunnyAnim.PNG"
    };

    document.getElementById("largeWeatherIcon").src =
        `../Assets/components/weatherTideCard/weatherIcons/largeIcons/${largeIcons[weather.current.condition]}`;
    document.getElementById("currentTemperature").innerHTML = `${weather.current.temperature}°C`;
    document.getElementById("currentTime").textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById("todayHigh").textContent =
        `↑ ${weather.today.high}°C`;

    document.getElementById("todayLow").textContent =
        `↓ ${weather.today.low}°C`;

    document.getElementById("currentCondition").textContent =
        `Today is ${weather.current.condition}!`;
}