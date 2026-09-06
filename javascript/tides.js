const TIDE_TEST_DATA = false;


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
        const tideData = await response.json();

        const extremes = [];

        tideData.table.rows.forEach(row => {

            const time = row[1];
            const type = row[2];

            extremes.push({
                type: type === "HIGH" ? "High" : "Low",
                dt: Math.floor(new Date(time).getTime() / 1000)
            });

        });

        data = {
            extremes: extremes
        };
    }


    console.log(data);

    let nextHigh = null;
    let nextLow = null;

    const now = new Date();

    data.extremes.forEach(tide => {

        const tideTime = new Date(tide.dt * 1000);

        if (tideTime > now) {

            if (tide.type === "High" && !nextHigh) {
                nextHigh = tide;
            }

            else if (tide.type === "Low" && !nextLow) {
                nextLow = tide;
            }
        }
    });

    displayTides(nextHigh, nextLow);
}


function displayTides(high, low) {

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    const highTime = new Date(high.dt * 1000);
    const lowTime = new Date(low.dt * 1000);

    let html = "";

    if (highTime < lowTime) {
        html = `
            ↑ : ${highTime.toLocaleTimeString([], options)}
            <br>
            ↓ : ${lowTime.toLocaleTimeString([], options)}
        `;
    } else {
        html = `
            ↓ : ${lowTime.toLocaleTimeString([], options)}
            <br>
            ↑ : ${highTime.toLocaleTimeString([], options)}
        `;
    }

    document.getElementById("tideText").innerHTML = html;
}


getTides();