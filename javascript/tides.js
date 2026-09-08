const TIDE_TEST_DATA = false;
let tideData = null;


async function getTides() {

    let data;

    if (TIDE_TEST_DATA) {

        data = {
            "extremes": [
                {
                    type: "High",
                    dt: Math.floor(Date.now() / 1000) + 60 * 60
                },
                {
                    type: "Low",
                    dt: Math.floor(Date.now() / 1000) + 4 * 60 * 60
                }
            ]
        };

    } else {

        const response = await fetch("/api/tides");
        const responseTideData = await response.json();

        const extremes = [];

        responseTideData.table.rows.forEach(row => {

            const time = row[1];
            const type = row[2];

            extremes.push({
                type: type === "HIGH" ? "High" : "Low",
                dt: Math.floor(new Date(time).getTime() / 1000),
                height: Number(row[3])
            });

        });

        data = {
            extremes: extremes
        };
    }


    console.log(data);

    tideData = data;

    const now = new Date();

    let nextHigh = null;
    let nextLow = null;


    /* Find today's tides */

    const today = now.toDateString();

    const todaysTides = tideData.extremes
        .filter(tide => {

            const tideDate = new Date(tide.dt * 1000);

            return tideDate.toDateString() === today;

        })
        .sort((a, b) => a.dt - b.dt);


    /* Find next high and next low */

    tideData.extremes.forEach(tide => {

        const tideTime = new Date(tide.dt * 1000);

        if (tideTime > now) {

            if (tide.type === "High" && nextHigh === null) {
                nextHigh = tide;
            }

            if (tide.type === "Low" && nextLow === null) {
                nextLow = tide;
            }

        }

    });


    displayTides(nextHigh, nextLow, todaysTides);
    drawTideCurve();
}


function displayTides(nextHigh, nextLow, todaysTides) {

    const options = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    };


    /*
     * Folded card
     */

    const nextHighTime = new Date(nextHigh.dt * 1000);
    const nextLowTime = new Date(nextLow.dt * 1000);

    let foldedHTML = "";

    if (nextHighTime < nextLowTime) {

        foldedHTML =
            `↑ : ${nextHighTime.toLocaleTimeString([], options)}<br>
             ↓ : ${nextLowTime.toLocaleTimeString([], options)}`;

    } else {

        foldedHTML =
            `↓ : ${nextLowTime.toLocaleTimeString([], options)}<br>
             ↑ : ${nextHighTime.toLocaleTimeString([], options)}`;

    }

    document.getElementById("tideText").innerHTML = foldedHTML;


    /*
     * Expanded card - all tides today
     */

    let todayHTML = "";

    todaysTides.forEach(tide => {

        const tideTime = new Date(tide.dt * 1000);

        const arrow = tide.type === "High" ? "↑" : "↓";

        todayHTML += `
            <div class="todayTide">
                ${arrow} ${tide.type}: ${tideTime.toLocaleTimeString([], options)}
            </div>
        `;

    });

    document.getElementById("todayTides").innerHTML = todayHTML;


    /*
     * Current tide status + next tide
     */

    const now = new Date();

    let nextTide = null;


    /* Find the next extreme */

    tideData.extremes.forEach(tide => {

        const tideTime = new Date(tide.dt * 1000);

        if (tideTime > now) {

            if (
                nextTide === null ||
                tideTime < new Date(nextTide.dt * 1000)
            ) {
                nextTide = tide;
            }

        }

    });


    /* Display current status and next tide */

    if (nextTide) {

        const nextTideTime =
            new Date(nextTide.dt * 1000);


        /* Rising if next tide is High */

        const status =
            nextTide.type === "High"
                ? "Rising"
                : "Falling";


        document.getElementById("tideStatus").textContent =
            `Current status: ${status}`;


        /* Calculate time remaining */

        const difference =
            nextTideTime - now;

        const totalMinutes =
            Math.floor(difference / 60000);

        const hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;


        document.getElementById("nextTide").innerHTML =
            `Next ${nextTide.type.toLowerCase()} tide:<br>${nextTideTime.toLocaleTimeString([], options)}<br>(${hours}h ${minutes}m)`;

    }

}

getTides();


const foldedWave = document.getElementById("foldedWave");

foldedWave.addEventListener("click", function () {

    document.getElementById("weatherExpanded").classList.add("open");

    document.getElementById("weatherView").style.display = "none";
    document.getElementById("tideView").style.display = "block";

    document.getElementById("foldedCardFront").classList.add("hidden");
    document.getElementById("foldedCardBackground").classList.add("hidden");
    document.getElementById("tideText").classList.add("hidden");
    document.getElementById("weatherText").classList.add("hidden");

});