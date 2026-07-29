function buildCalendar() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var todayDate = today.getDate();

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var firstDayOfMonth = new Date(year, month, 1);
    var startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // monday = first day of the week
    var startOffset = startDayOfWeek - 1;
    if (startDayOfWeek === 0) {
        startOffset = 6;
    }

    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = `<div class="calendarHeading">${monthNames[month]} ${year}</div>`;
    html += `<div class="calendarGrid">`;

    var dayLetters = ["M", "T", "W", "T", "F", "S", "S"];
    dayLetters.forEach(letter => {
        html += `<div class = "dayLetter">${letter}</div>`;
    });

    for (var i = 0; i < startOffset; i++) {
        html += `<div class="calendarDay empty"></div>`;
    }
    for (var dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        if (dayNum === todayDate) {
            html += `<div class = "calendarDay today">${dayNum}</div>`;
        } else {
            html += `<div class = "calendarDay">${dayNum}</div>`;
        }
    }
    html += `</div>`;
    document.getElementById("calendarText").innerHTML = html;
}

buildCalendar();