const locations = {

    downings: {
        name: "Downings",
        lat: 55.19345254991711,
        lon: -7.836906631516278
    },

    home: {
        name: "Home",
        lat: 55.06234,
        lon: -6.3054312
    },

    uniCity: {
        name: "Belfast",
        lat: 54.5968,
        lon: -5.9254
    }

};

function getSelectedLocation() {

    const savedLocation =
        localStorage.getItem("selectedLocation");

    return locations[savedLocation] || locations.downings;

}

document.addEventListener("DOMContentLoaded", function () {

    const locationPen = document.getElementById("locationPen");
    const locationPicker = document.getElementById("locationPicker");
    const saveLocation = document.getElementById("saveLocation");

    locationPen.addEventListener("click", function () {

        locationPicker.classList.toggle("open");

    });


    saveLocation.addEventListener("click", function () {

        const selectedLocation =
            document.querySelector('input[name="location"]:checked');

        if (!selectedLocation) {
            return;
        }

        localStorage.setItem(
            "selectedLocation",
            selectedLocation.value
        );

        locationPicker.classList.remove("open");

        getWeather();

    });


    const savedLocation =
        localStorage.getItem("selectedLocation");

    if (savedLocation) {

        const radioButton =
            document.querySelector(
                `input[name="location"][value="${savedLocation}"]`
            );

        if (radioButton) {
            radioButton.checked = true;
        }

    }

});