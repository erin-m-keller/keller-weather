let schedulerTimes = [
    { hour: 9, mins: ["00","15","30","45"], text: "nine" },
    { hour: 10, mins: ["00","15","30","45"], text: "ten" },
    { hour: 11, mins: ["00","15","30","45"], text: "eleven" },
    { hour: 12, mins: ["00","15","30","45"], text: "twelve" },
    { hour: 1, mins: ["00","15","30","45"], text: "one" },
    { hour: 2, mins: ["00","15","30","45"], text: "two" },
    { hour: 3, mins: ["00","15","30","45"], text: "three" },
    { hour: 4, mins: ["00","15","30","45"], text: "four" },
    { hour: 5, mins: ["00","15","30","45"], text: "five" }
]

/**
 * @init
 * runs on page load
 */
function init() {
    generateScheduler();
}
init();

/**
 * @generateScheduler
 * creates and appends the scheduler
 * to the page
 */
function generateScheduler() {
    for (var i = 0; i < schedulerTimes.length; i++) {
        let scheduler = $("<div class=\"scheduler\"></div>"),
            minWrapper = $("<div class=\"min-wrapper\"></div>"),
            entriesWrapper = $("<div class=\"entries-wrapper\"></div>"),
            hourWrapper = $("<div class=\"hour-wrapper\"></div>"),
            minList = $("<ul></ul>"),
            entryList = $("<ul></ul>");
        let hour = schedulerTimes[i].hour,
            text = schedulerTimes[i].text;
        $(hourWrapper).append("<h2>" + hour + "</h2>");
        for (var j = 0; j < schedulerTimes[i].mins.length; j++) {
            let min = schedulerTimes[i].mins[j];
            $(minList).append("<li>" + min + "</li>");
            $(entryList).append("<li><label for=\"" + text + "-slot" + j + "\" class=\"screen-reader\">" + hour + ":" + min + "</label><textarea id=\"" + text + "-slot" + j + "\" name=\"" + text + "-slot" + j + "\" rows=\"4\" cols=\"50\"></textarea></li>");
        }
        $(minWrapper).append(minList);
        $(entriesWrapper).append(entryList);
        $(scheduler).append(hourWrapper);
        $(scheduler).append(minWrapper);
        $(scheduler).append(entriesWrapper);
        $(".scheduler-wrapper").append(scheduler);
    }
}