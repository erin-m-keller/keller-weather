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
    // callback function will execute @checkForData once @generateScheduler has completed
    generateScheduler(function() {
        checkForData();
    });
    // get the current date and append to the page
    let time = dayjs(new Date()).format('MMM D, YYYY');
    $(".current-date").append(time);
}
init();

/**
 * @generateScheduler
 * creates and appends the scheduler
 * to the page
 */
function generateScheduler(callback) {
    // for loop runs for each element in schedulerTimes array
    for (let i = 0; i < schedulerTimes.length; i++) {
        // initialize the variables
        let scheduler = $("<div class=\"scheduler\"></div>"),
            minWrapper = $("<div class=\"min-wrapper\"></div>"),
            entriesWrapper = $("<div class=\"entries-wrapper\"></div>"),
            hourWrapper = $("<div class=\"hour-wrapper\"></div>"),
            minList = $("<ul></ul>"),
            entryList = $("<ul></ul>");
        let hour = schedulerTimes[i].hour,
            text = schedulerTimes[i].text;
        $(hourWrapper).append("<h2>" + hour + "</h2>");
        for (let j = 0; j < schedulerTimes[i].mins.length; j++) {
            let min = schedulerTimes[i].mins[j];
            $(minList).append("<li>" + min + "</li>");
            $(entryList).append("<li><form id=\"form-" + text + "-" + min + "\" onsubmit=\"saveEntry(this);return false\"><label for=\"" + text + "-" + min + "\" class=\"screen-reader\">" + hour + ":" + min + "</label><textarea id=\"" + text + "-" + min + "\" name=\"" + text + "-" + min + "\" rows=\"4\" cols=\"25\" required></textarea><button type=\"submit\">Save</button></form></li>");
        }
        $(minWrapper).append(minList);
        $(entriesWrapper).append(entryList);
        $(scheduler).append(hourWrapper);
        $(scheduler).append(minWrapper);
        $(scheduler).append(entriesWrapper);
        $(".scheduler-wrapper").append(scheduler);
    }
    callback();
}
/**
 * @checkForData
 * checks local storage for saved data
 */
function checkForData() {
    let existingEntries = JSON.parse(localStorage.getItem("SchedulerTasks"));
    if (existingEntries) {
        for (let i = 0; i < existingEntries.length; i++) {
            let elemId = existingEntries[i].id,
                elemVal = existingEntries[i].val;
            $(elemId).val(elemVal);
        }
   }
}
/**
 * @saveEntry
 * function saves entry to local storage
 */
function saveEntry(selectedVal) {
    // initialize variables
    let elemId = "#" + selectedVal.id.replace('form-',''),
        entryVal = $(elemId).val(),
        newArr = [],
        existingEntries = JSON.parse(localStorage.getItem("SchedulerTasks")),
        entriesObj = { id: elemId, val: entryVal };
    // create a new entry object
    newArr.push(entriesObj);
    // if local storage exists
    if (existingEntries) {
        // check if ID already exists
        let existingEntry = existingEntries.find(a => a.id === elemId);
        // if ID exists, update the specific value
        if (existingEntry) {
            let existingId = existingEntry.id;
            Object.keys(existingEntries).forEach((elem) => {
                if (existingEntries[elem].id === existingId) {
                    existingEntries[elem].val = entryVal;
                }
            });
            // save to local storage
            localStorage.setItem("SchedulerTasks", JSON.stringify(existingEntries));
        } else {
            // if no ID exists, concatenate the old list with the new one and save to local storage
            combinedArr = existingEntries.concat(newArr);
            localStorage.setItem("SchedulerTasks", JSON.stringify(combinedArr));
        }
    } else {
      // save to local storage
      localStorage.setItem("SchedulerTasks", JSON.stringify(newArr));
    }
}