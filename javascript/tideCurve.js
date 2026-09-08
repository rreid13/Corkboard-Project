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


    /*
     * Get all tides and make sure they are
     * in chronological order
     */

    const tides =
        [...tideData.extremes]
            .filter(tide => tide.height !== undefined)
            .sort((a, b) => a.dt - b.dt);


    if (tides.length < 2) {
        console.log("Not enough tide data");
        return;
    }


    const now =
        new Date();


    /*
     * The graph shows approximately
     * 12 hours either side of now.
     *
     * The current time will therefore
     * always be in the centre.
     */

    const twelveHours =
        12 * 60 * 60 * 1000;


    const graphStart =
        now.getTime() - twelveHours;


    const graphEnd =
        now.getTime() + twelveHours;


    /*
     * Find the tide immediately before
     * the beginning of the graph.
     */

    let firstTide = null;


    for (let i = 0; i < tides.length; i++) {

        if (tides[i].dt * 1000 <= graphStart) {

            firstTide = tides[i];

        }

    }


    /*
     * Find the tide immediately after
     * the end of the graph.
     */

    let lastTide = null;


    for (let i = 0; i < tides.length; i++) {

        if (tides[i].dt * 1000 >= graphEnd) {

            lastTide = tides[i];

            break;

        }

    }


    if (!firstTide || !lastTide) {

        console.log("Not enough surrounding tide data");

        return;

    }


    /*
     * Get every tide between the first
     * and last visible tide.
     */

    const visibleTides =
        tides.filter(tide => {

            return (
                tide.dt * 1000 >= firstTide.dt * 1000 &&
                tide.dt * 1000 <= lastTide.dt * 1000
            );

        });


    console.log("Visible tides:", visibleTides);


    /*
     * SVG dimensions
     */

    const width = 400;
    const height = 180;


    const svgNS =
        "http://www.w3.org/2000/svg";


    /*
     * Create SVG
     */

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
     * Graph dimensions
     */

    const graphLeft = 20;
    const graphRight = 380;

    const graphTop = 15;
    const graphBottom = 170;


    /*
     * Find minimum and maximum
     * tide heights.
     */

    const heights =
        visibleTides.map(
            tide => tide.height
        );


    const minHeight =
        Math.min(...heights);


    const maxHeight =
        Math.max(...heights);


    /*
     * Add a little padding so the curve
     * doesn't touch the top/bottom.
     */

    const heightPadding =
        (maxHeight - minHeight) * 0.15;


    const displayMin =
        minHeight - heightPadding;


    const displayMax =
        maxHeight + heightPadding;


    /*
     * Convert a tide height into
     * an SVG Y position.
     */

    function heightToY(tideHeight) {

        const proportion =
            (tideHeight - displayMin) /
            (displayMax - displayMin);


        return (
            graphBottom -
            proportion *
            (graphBottom - graphTop)
        );

    }


    /*
     * Convert a time into an X position.
     *
     * IMPORTANT:
     *
     * Current time is ALWAYS in the centre.
     */

    const centreX =
        width / 2;


    const pixelsPerHour =
        (width / 24);


    function timeToX(time) {

        const difference =
            time.getTime() -
            now.getTime();


        const hours =
            difference /
            (60 * 60 * 1000);


        return (
            centreX +
            hours * pixelsPerHour
        );

    }


    /*
     * Create smooth curve
     */

    const points = [];


    const pointsPerSection = 40;


    for (
        let i = 0;
        i < visibleTides.length - 1;
        i++
    ) {

        const startTide =
            visibleTides[i];


        const endTide =
            visibleTides[i + 1];


        const startTime =
            startTide.dt * 1000;


        const endTime =
            endTide.dt * 1000;


        for (
            let j = 0;
            j <= pointsPerSection;
            j++
        ) {

            const progress =
                j / pointsPerSection;


            /*
             * Cosine interpolation creates
             * a smooth tide-like curve.
             */

            const easedProgress =
                (1 -
                    Math.cos(
                        Math.PI * progress
                    )
                ) / 2;


            const tideHeight =
                startTide.height +
                (
                    endTide.height -
                    startTide.height
                ) *
                easedProgress;


            const time =
                startTime +
                (
                    endTime -
                    startTime
                ) *
                progress;


            const x =
                timeToX(
                    new Date(time)
                );


            const y =
                heightToY(
                    tideHeight
                );


            points.push(
                `${x},${y}`
            );

        }

    }

    /*
     * Draw curve
     */

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
     * Draw labels for each high/low tide
     */

    visibleTides.forEach((tide, index) => {

        const tideTime =
            new Date(
                tide.dt * 1000
            );


        const x =
            timeToX(tideTime);


        /*
         * Don't draw labels that are
         * completely outside the graph.
         */

        if (
            x < graphLeft - 30 ||
            x > graphRight + 30
        ) {
            return;
        }


        const y =
            heightToY(
                tide.height
            );


        /*
         * Small dot at each extreme
         */

        const dot =
            document.createElementNS(
                svgNS,
                "circle"
            );


        dot.setAttribute(
            "cx",
            x
        );


        dot.setAttribute(
            "cy",
            y
        );


        dot.setAttribute(
            "r",
            "3"
        );


        dot.setAttribute(
            "fill",
            "rgb(59, 39, 60)"
        );


        svg.appendChild(dot);


        /*
         * Tide type label
         */

        const typeLabel =
            document.createElementNS(
                svgNS,
                "text"
            );


        typeLabel.setAttribute(
            "x",
            x
        );


        typeLabel.setAttribute(
            "text-anchor",
            "middle"
        );


        typeLabel.setAttribute(
            "font-family",
            "RionaHandwriting"
        );


        typeLabel.setAttribute(
            "font-size",
            "15"
        );


        typeLabel.setAttribute(
            "font-weight",
            "bold"
        );


        typeLabel.setAttribute(
            "fill",
            "rgb(59, 39, 60)"
        );


        /*
         * High labels go above the curve.
         * Low labels go below the curve.
         */

        if (tide.type === "High") {

            typeLabel.setAttribute(
                "y",
                y - 24
            );

        } else {

            typeLabel.setAttribute(
                "y",
                y + 31
            );

        }


        typeLabel.textContent =
            tide.type.toUpperCase();


        /*
         * Give each label a tiny,
         * consistent rotation.
         */

        const rotations = [
            -3,
            2,
            -2,
            3,
            -1
        ];


        const rotation =
            rotations[index % rotations.length];


        typeLabel.setAttribute(
            "transform",
            `rotate(${rotation} ${x} ${tide.type === "High" ? y - 24 : y + 31})`
        );


        svg.appendChild(typeLabel);


        /*
         * Tide time
         */

        const timeLabel =
            document.createElementNS(
                svgNS,
                "text"
            );


        timeLabel.setAttribute(
            "x",
            x
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
            "15"
        );


        timeLabel.setAttribute(
            "fill",
            "rgb(59, 39, 60)"
        );


        if (tide.type === "High") {

            timeLabel.setAttribute(
                "y",
                y - 10
            );

        } else {

            timeLabel.setAttribute(
                "y",
                y + 18
            );

        }


        /*
         * 12-hour time
         */

        timeLabel.textContent =
            tideTime.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }
            );


        svg.appendChild(timeLabel);

    });


    /*
     * Calculate current tide level
     */

    let previousTide = null;
    let nextTide = null;


    visibleTides.forEach(tide => {

        const tideTime =
            tide.dt * 1000;


        if (tideTime <= now.getTime()) {

            previousTide = tide;

        }


        if (
            tideTime > now.getTime() &&
            nextTide === null
        ) {

            nextTide = tide;

        }

    });


    if (!previousTide || !nextTide) {
        return;
    }


    const previousTime =
        previousTide.dt * 1000;


    const nextTime =
        nextTide.dt * 1000;


    const progress =
        (
            now.getTime() -
            previousTime
        ) /
        (
            nextTime -
            previousTime
        );


    /*
     * Smooth interpolation between
     * the actual previous and next heights.
     */

    const easedProgress =
        (1 -
            Math.cos(
                Math.PI * progress
            )
        ) / 2;


    const currentHeight =
        previousTide.height +
        (
            nextTide.height -
            previousTide.height
        ) *
        easedProgress;


    const currentX =
        centreX;


    const currentY =
        heightToY(
            currentHeight
        );


    /*
     * Current time line
     */

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
        "0"
    );


    currentLine.setAttribute(
        "y2",
        "180"
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
        "4"
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
        "20"
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
                minute: "2-digit",
                hour12: true
            }
        );


    svg.appendChild(timeLabel);

}

setInterval(() => {
    drawTideCurve();
}, 60000);