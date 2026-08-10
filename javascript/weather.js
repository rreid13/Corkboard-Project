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
            },

            hourly: [
                { condition: "Sunny", temperature: 18 },
                { condition: "Sunny", temperature: 17 },
                { condition: "Clear", temperature: 16 },
                { condition: "Clear", temperature: 15 },
                { condition: "Cloudy", temperature: 15 },
                { condition: "Cloudy", temperature: 14 },
                { condition: "Rain", temperature: 14 },
                { condition: "Rain", temperature: 13 },
                { condition: "Cloudy", temperature: 13 },
                { condition: "Sunny", temperature: 14 },
                { condition: "Sunny", temperature: 16 },
                { condition: "Sunny", temperature: 18 }
            ],

            daily: [
                { condition: "Sunny", low: 12, high: 20 },
                { condition: "Cloudy", low: 13, high: 21 },
                { condition: "Rain", low: 16, high: 22 },
                { condition: "Rain", low: 16, high: 22 },
                { condition: "Light Rain", low: 14, high: 16 },
                { condition: "Light Rain", low: 13, high: 16 },
                { condition: "Light Rain", low: 13, high: 16 }

            ]
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
const foldTab = document.getElementById("foldTab");
const weatherExpanded = document.getElementById("weatherExpanded");

foldedWeatherIcon.addEventListener("click", function () {
    weatherExpanded.classList.toggle("open");
    document.getElementById("foldedCardFront").classList.toggle("hidden");
    document.getElementById("sunnySea").classList.toggle("hidden");
    document.getElementById("tideText").classList.toggle("hidden");
    document.getElementById("weatherText").classList.toggle("hidden");
});

foldTab.addEventListener("click", function () {
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
    document.getElementById("currentTime").textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    document.getElementById("todayHigh").textContent =
        `↑ ${weather.today.high}°C`;

    document.getElementById("todayLow").textContent =
        `↓ ${weather.today.low}°C`;

    document.getElementById("currentCondition").textContent =
        `Today is ${weather.current.condition}!`;

    displayHourlyWeather(weather);
    displayDailyWeather(weather);
}

function displayHourlyWeather(weather) {

    const hourlyWeatherContainer = document.getElementById("hourlyWeather");

    const smallIcons = {
        "Sunny": "sunny.PNG",
        "Clear": "clear.PNG",
        "Cloudy": "cloudy.PNG",
        "Partly Cloudy": "partlyCloudy.PNG",
        "Rain": "rain.PNG",
        "Light Rain": "lightRain.PNG",
        "Heavy Rain": "heavyRain.PNG",
        "Snow": "snow.PNG",
        "Heavy Snow": "heavySnow.PNG",
        "Blowing Snow": "blowingSnow.PNG",
        "Fog": "fog.PNG",
        "Hail": "hail.PNG",
        "Lightning": "lightning.PNG",
        "Wind": "wind.PNG"
    };
    const now = new Date();
    const currentHour = now.getHours();

    let html = "";

    weather.hourly.forEach((hour, index) => {

        const forecastHour = (currentHour + index) % 24;

        const time = new Date();
        time.setHours(forecastHour, 0, 0, 0);

        const timeText = time.toLocaleTimeString([], {
            hour: "numeric",
            hour12: true
        });

        html += `
        <div class="hourlyForecast">

            <div class="hourlyTime">
                ${timeText}
            </div>

            <img
                class="hourlyIcon"
                src="../Assets/components/weatherTideCard/weatherIcons/smallIcons/${smallIcons[hour.condition]}"
            >

            <div class="hourlyTemperature">
                ${hour.temperature}°C
            </div>

        </div>
    `;
    });

    hourlyWeatherContainer.innerHTML = html;
}

function displayDailyWeather(weather) {
    const dailyWeatherContainer = document.getElementById("dailyWeather");

    const smallIcons = {
        "Sunny": "sunny.PNG",
        "Clear": "clear.PNG",
        "Cloudy": "cloudy.PNG",
        "Partly Cloudy": "partlyCloudy.PNG",
        "Rain": "rain.PNG",
        "Light Rain": "lightRain.PNG",
        "Heavy Rain": "heavyRain.PNG",
        "Snow": "snow.PNG",
        "Heavy Snow": "heavySnow.PNG",
        "Blowing Snow": "blowingSnow.PNG",
        "Fog": "fog.PNG",
        "Hail": "hail.PNG",
        "Lightning": "lightning.PNG",
        "Wind": "wind.PNG"
    };
    let html = "";
    weather.daily.slice(0, 5).forEach((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);

        const dayName = date.toLocaleDateString("en-GB", {
            weekday: "short"
        }).toUpperCase();

        const dayNumber = date.getDate();
        const month = date.getMonth() + 1;

        html += `
        <div class="dailyForecast">

        <div class="dailyDate">
        <span class="dailyDay">${dayName}</span>
        <span class="dailyDayNumber">${dayNumber}/${month}</span>
        </div>

        <img
            class="dailyIcon"
            src="../Assets/components/weatherTideCard/weatherIcons/smallIcons/${smallIcons[day.condition]}"
        >

        <div class="dailyTemperature">
                    ${day.low}°C → ${day.high}°C
                </div>
        </div>
    `;

    });

    dailyWeatherContainer.innerHTML = html;
}