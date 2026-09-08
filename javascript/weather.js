console.log("weather.js loaded");

const WEATHER_TEST_DATA = false;

async function getWeather() {
    let weather;

    if (WEATHER_TEST_DATA) {
        weather = {
            current: {
                condition: "Lightning",
                temperature: 18,
                is_day: 0
            },

            today: {
                high: 20,
                low: 12
            },

            hourly: [
                { condition: "Snow", temperature: 18 },
                { condition: "Sunny", temperature: 17 },
                { condition: "Wind", temperature: 16 },
                { condition: "Fog", temperature: 15 },
                { condition: "Hail", temperature: 15 },
                { condition: "Heavy Rain", temperature: 14 },
                { condition: "Heavy Snow", temperature: 14 },
                { condition: "Lightning", temperature: 13 },
                { condition: "Light Rain", temperature: 13 },
                { condition: "Partly Clear", temperature: 14 },
                { condition: "Partly Cloudy", temperature: 16 },
                { condition: "Rain", temperature: 18 }
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

        const location = getSelectedLocation();

        console.log("Selected location:", location);
        console.log("Weather URL:", `/api/weather?lat=${location.lat}&lon=${location.lon}`);

        const response = await fetch(
            `/api/weather?lat=${location.lat}&lon=${location.lon}`
        );

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
    document.getElementById("foldedCardBackground").classList.toggle("hidden");
    document.getElementById("tideText").classList.toggle("hidden");
    document.getElementById("weatherText").classList.toggle("hidden");
});

foldTab.addEventListener("click", function () {
    weatherExpanded.classList.toggle("open");
    document.getElementById("foldedCardFront").classList.toggle("hidden");
    document.getElementById("foldedCardBackground").classList.toggle("hidden");
    document.getElementById("tideText").classList.toggle("hidden");
    document.getElementById("weatherText").classList.toggle("hidden");
});

function displayCurrentWeather(weather) {
    const largeIcons = {
        "Sunny": "sunnyAnim.PNG",
        "Clear": "clearAnim.PNG",
        "Cloudy": "cloudyAnim.PNG",
        "Partly Cloudy": "partlyCloudyAnim.PNG",
        "Partly Clear": "partlyClearAnim.PNG",
        "Rain": "rainAnim.PNG",
        "Light Rain": "lightRainAnim.PNG",
        "Heavy Rain": "heavyRainAnim.PNG",
        "Snow": "snowAnim.PNG",
        "Heavy Snow": "heavySnowAnim.PNG",
        "Blowing Snow": "blowingSnowAnim.PNG",
        "Fog": "fogAnim.PNG",
        "Hail": "hailAnim.PNG",
        "Lightning": "lightningAnim.PNG",
        "Wind": "windAnim.PNG"
    };

    const iconFile = largeIcons[weather.current.condition];

    document.getElementById("largeWeatherIcon").src =
        `../Assets/components/weatherTideCard/weatherIcons/largeIcons/${iconFile}`;

    document.getElementById("foldedWeatherIcon").src =
        `../Assets/components/weatherTideCard/weatherIcons/largeIcons/${iconFile}`;

    document.getElementById("currentTemperature").innerHTML = `${weather.current.temperature}°C`;
    document.getElementById("currentTime").textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    document.getElementById("todayHigh").textContent =
        `↑ ${weather.today.high}°C`;

    document.getElementById("todayLow").textContent =
        `↓ ${weather.today.low}°C`;

    document.getElementById("currentCondition").textContent =
        getWeatherMessage(weather.current.condition);

    displayHourlyWeather(weather);
    displayDailyWeather(weather);
    displayWeatherBackground(weather);
    updateCardTextColour(weather);
}

function displayHourlyWeather(weather) {

    const hourlyWeatherContainer = document.getElementById("hourlyWeather");

    const smallIcons = {
        "Sunny": "sunny.PNG",
        "Clear": "clear.PNG",
        "Cloudy": "cloudy.PNG",
        "Partly Cloudy": "partlyCloudy.PNG",
        "Partly Clear": "partlyClear.PNG",
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

function getWeatherMessage(condition) {

    const messages = {
        "Sunny": "It's sunny today!",
        "Clear": "It's clear tonight!",
        "Cloudy": "It's cloudy today!",
        "Partly Cloudy": "It's partly cloudy today!",
        "Partly Clear": "It's partly clear tonight!",
        "Rain": "It's rainy today!",
        "Light Rain": "There's light rain today!",
        "Heavy Rain": "There's heavy rain today!",
        "Snow": "It's snowy today!",
        "Heavy Snow": "It's snowing heavily today!",
        "Blowing Snow": "It's blowing snow today!",
        "Fog": "It's foggy today!",
        "Hail": "It's hailing today!",
        "Lightning": "Theres lightning today!",
        "Wind": "It's windy today!"
    };

    return messages[condition] || `Today is ${condition.toLowerCase()}!`;
}

function displayWeatherBackground(weather) {

    const backgrounds = {
        bright: "brightBackground.PNG",
        grey: "greyBackground.PNG",
        dull: "dullBackground.PNG",
        starry: "starryBackground.PNG"
    };

    const waves = {
        dayCalm: "dayCalmWave.PNG",
        dayChoppy: "dayChoppyWave.PNG",
        dullCalm: "dullCalmWave.PNG",
        dullChoppy: "dullChoppyWave.PNG",
        nightCalm: "nightCalmWave.PNG",
        nightChoppy: "nightChoppyWave.PNG"
    };

    let background;
    let wave;

    const condition = weather.current.condition;
    const isNight = weather.current.is_day === 0;

    // Determine background
    if (isNight) {
        background = backgrounds.starry;
    }

    else if (
        condition === "Sunny" ||
        condition === "Partly Cloudy" ||
        condition === "Light Rain" ||
        condition === "Snow" ||
        condition === "Cloudy" ||
        condition === "Wind"
    ) {
        background = backgrounds.bright;
    }

    else if (
        condition === "Fog" ||
        condition === "Heavy Snow" ||
        condition === "Blowing Snow" ||
        condition === "Hail"
    ) {
        background = backgrounds.grey;
    }

    else if (
        condition === "Rain" ||
        condition === "Heavy Rain" ||
        condition === "Lightning"
    ) {
        background = backgrounds.dull;
    }

    // Determine wave
    if (isNight) {

        if (
            condition === "Rain" ||
            condition === "Heavy Rain" ||
            condition === "Lightning" ||
            condition === "Fog" ||
            condition === "Heavy Snow" ||
            condition === "Blowing Snow" ||
            condition === "Hail"
        ) {
            wave = waves.nightChoppy;
        } else {
            wave = waves.nightCalm;
        }

    } else {

        if (
            condition === "Rain" ||
            condition === "Heavy Rain" ||
            condition === "Lightning"
        ) {
            wave = waves.dayChoppy;
        }

        else if (
            condition === "Heavy Snow" ||
            condition === "Blowing Snow" ||
            condition === "Hail"
        ) {
            wave = waves.dullChoppy;
        }

        else if (
            condition === "Fog"
        ) {
            wave = waves.dullCalm;
        }

        else {
            wave = waves.dayCalm;
        }
    }

    document.getElementById("foldedCardBackground").src =
        `../Assets/components/weatherTideCard/backgrounds/${background}`;

    document.getElementById("foldedWave").src =
        `../Assets/components/weatherTideCard/waves/${wave}`;
}

function updateCardTextColour(weather) {

    if (weather.current.is_day === 0) {
        document.getElementById("weatherText").classList.add("night");
        document.getElementById("tideText").classList.add("night");
    } else {
        document.getElementById("weatherText").classList.remove("night");
        document.getElementById("tideText").classList.remove("night");
    }
}