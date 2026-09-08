console.log("tideCurve.js loaded");


function drawTideCurve() {

    const container =
        document.getElementById("tideCurveContainer");

    if (!container) {
        console.log("Tide curve container not found");
        return;
    }


    if (!tideData || !tideData.extremes) {
        console.log("No tide data yet");
        return;
    }


    const now = new Date();


    /*
     * Find previous and next tide
     */

    let previousTide = null;
    let nextTide = null;


    tideData.extremes.forEach(tide => {

        const tideTime =
            new Date(tide.dt * 1000);


        if (tideTime <= now) {

            if (
                previousTide === null ||
                tideTime >
                new Date(previousTide.dt * 1000)
            ) {

                previousTide = tide;

            }

        }


        if (tideTime > now) {

            if (
                nextTide === null ||
                tideTime <
                new Date(nextTide.dt * 1000)
            ) {

                nextTide = tide;

            }

        }

    });


    console.log("Previous tide:", previousTide);
    console.log("Next tide:", nextTide);


    if (!previousTide || !nextTide) {

        console.log("Could not find previous/next tide");

        return;

    }


    /*
     * Calculate progress between tides
     */

    const previousTime =
        previousTide.dt * 1000;

    const nextTime =
        nextTide.dt * 1000;

    const currentTime =
        now.getTime();


    const progress =
        (currentTime - previousTime) /
        (nextTime - previousTime);


    /*
     * Calculate current tide level
     */

    let tideLevel;


    if (previousTide.type === "Low") {

        tideLevel =
            (1 - Math.cos(Math.PI * progress)) / 2;

    } else {

        tideLevel =
            (1 + Math.cos(Math.PI * progress)) / 2;

    }


    /*
     * Create SVG
     */

    const width = 400;
    const height = 180;

    const svgNS =
        "http://www.w3.org/2000/svg";


    const svg =
        document.createElementNS(
            svgNS,
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

    svg.setAttribute(
        "width",
        "100%"
    );

    svg.setAttribute(
        "height",
        "100%"
    );


    container.innerHTML = "";

    container.appendChild(svg);


    /*
     * Create curve
     */

    const points = [];

    const numberOfPoints = 100;


    for (
        let i = 0;
        i <= numberOfPoints;
        i++
    ) {

        const p =
            i / numberOfPoints;


        let level;


        if (previousTide.type === "Low") {

            level =
                (1 - Math.cos(Math.PI * p)) / 2;

        } else {

            level =
                (1 + Math.cos(Math.PI * p)) / 2;

        }


        const x =
            20 + p * (width - 40);


        const y =
            140 - level * 100;


        points.push(`${x},${y}`);

    }


    const path =
        document.createElementNS(
            svgNS,
            "polyline"
        );


    path.setAttribute(
        "points",
        points.join(" ")
    );

    path.setAttribute(
        "fill",
        "none"
    );

    path.setAttribute(
        "stroke",
        "rgb(59, 39, 60)"
    );

    path.setAttribute(
        "stroke-width",
        "3"
    );

    path.setAttribute(
        "stroke-linecap",
        "round"
    );

    path.setAttribute(
        "stroke-linejoin",
        "round"
    );


    svg.appendChild(path);


    /*
     * Current time line
     */

    const currentX =
        20 + progress * (width - 40);


    const currentLine =
        document.createElementNS(
            svgNS,
            "line"
        );


    currentLine.setAttribute(
        "x1",
        currentX
    );

    currentLine.setAttribute(
        "x2",
        currentX
    );

    currentLine.setAttribute(
        "y1",
        "15"
    );

    currentLine.setAttribute(
        "y2",
        "155"
    );

    currentLine.setAttribute(
        "stroke",
        "rgb(190, 70, 70)"
    );

    currentLine.setAttribute(
        "stroke-width",
        "2"
    );

    currentLine.setAttribute(
        "stroke-dasharray",
        "5 5"
    );


    svg.appendChild(currentLine);


    /*
     * Current tide dot
     */

    const currentY =
        140 - tideLevel * 100;


    const currentDot =
        document.createElementNS(
            svgNS,
            "circle"
        );


    currentDot.setAttribute(
        "cx",
        currentX
    );

    currentDot.setAttribute(
        "cy",
        currentY
    );

    currentDot.setAttribute(
        "r",
        "5"
    );

    currentDot.setAttribute(
        "fill",
        "rgb(190, 70, 70)"
    );


    svg.appendChild(currentDot);


    /*
     * Current time label
     */

    const timeLabel =
        document.createElementNS(
            svgNS,
            "text"
        );


    timeLabel.setAttribute(
        "x",
        currentX
    );

    timeLabel.setAttribute(
        "y",
        "12"
    );

    timeLabel.setAttribute(
        "text-anchor",
        "middle"
    );

    timeLabel.setAttribute(
        "font-family",
        "RionaHandwriting"
    );

    timeLabel.setAttribute(
        "font-size",
        "12"
    );

    timeLabel.setAttribute(
        "fill",
        "rgb(190, 70, 70)"
    );


    timeLabel.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    svg.appendChild(timeLabel);

}