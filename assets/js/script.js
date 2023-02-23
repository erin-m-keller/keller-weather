// initialize global variables
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
];

/**
 * @init
 * runs on page load
 */
function init() {
    // callback function will execute inner functions once @generateScheduler has completed
    generateScheduler(function() {
        // check for local storage
        checkForData();
        // set the date
        setDate();
        // update time every second
        setInterval(setClock, 1000);
        // color code entries
        setInterval(colorCodeEntries, 1000);
    });
}
init();
/**
 * @setDate
 * sets the date on the page
 */
function setDate() {
    // initialize variables
    let date = dayjs(new Date()).format('MMM D, YYYY');
    // append to page
    $(".current-date").append(date);
}
/**
 * @setClock
 * sets the clock on the page
 */
function setClock() {
    // initialize variables
    let now = dayjs(),
        currentTime = now.format("h:mm:ss a");
    // append to page
    $(".current-time").empty();
    $(".current-time").append(currentTime);
}
/**
 * @clearEntry
 * clear the selected entry from local storage
 */
function clearEntry(selectedVal) {
    // initialize variables
    let elemId = "#" + selectedVal.id.replace('btn-',''),
        existingEntries = JSON.parse(localStorage.getItem("SchedulerTasks")),
        entryIdx = existingEntries.findIndex((obj) => obj.id === elemId);
    // if ID exists, remove the object from the array and update local storage
    if (entryIdx > -1) {
        existingEntries.splice(entryIdx, 1);
        localStorage.setItem("SchedulerTasks", JSON.stringify(existingEntries));
        $(elemId).val('').focus();
    }
}
/**
 * @generateScheduler
 * creates and appends the scheduler
 * to the page
 */
function generateScheduler(callback) {
    // for loop runs for each element in schedulerTimes array
    for (let i = 0; i < schedulerTimes.length; i++) {
        // initialize the variables
        let minWrapper = $("<div class=\"min-wrapper\"></div>"),
            entriesWrapper = $("<div class=\"entries-wrapper\"></div>"),
            hourWrapper = $("<div class=\"hour-wrapper\"></div>"),
            minList = $("<ul></ul>"),
            entryList = $("<ul></ul>"),
            hour = schedulerTimes[i].hour,
            text = schedulerTimes[i].text,
            scheduler = $("<div class=\"scheduler\" id=\"" + text + "\"></div>")
        $(hourWrapper).append("<h2>" + hour + "</h2>");
        for (let j = 0; j < schedulerTimes[i].mins.length; j++) {
            let min = schedulerTimes[i].mins[j];
            $(minList).append("<li>" + min + "</li>");
            $(entryList).append("<li><form id=\"form-" + text + "-" + min + "\" onsubmit=\"saveEntry(this);return false\"><label for=\"" + text + "-" + min + "\" class=\"screen-reader\">" + hour + ":" + min + "</label><textarea id=\"" + text + "-" + min + "\" name=\"" + text + "-" + min + "\" rows=\"4\" cols=\"25\" required></textarea><div class=\"btn-wrapper\"><button type=\"button\" id=\"btn-" + text + "-" + min + "\" onclick=\"clearEntry(this)\">Clear</button><button type=\"submit\">Save</button></div></form></li>");
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
 * @colorCodeEntries
 * sets background color of text blocks
 * if time is in past, present or future
 */
function colorCodeEntries() {
    // initialize variables
    let now = dayjs(),
        currentTime = now.format("h:mm"),
        fullTime = now.format("h:mm a"),
        currentSetting = fullTime.substring(fullTime.indexOf(' ') + 1),
        currentHour = currentTime.substring(0, currentTime.indexOf(":")), 
        currentMinute = currentTime.substring(currentTime.lastIndexOf(':')+1);
    // loop through the available entry times
    for (let i = 0; i < schedulerTimes.length; i++) {
        // initialize variables
        let txt = schedulerTimes[i].text,
            hour = schedulerTimes[i].hour, 
            mins = schedulerTimes[i].mins;
        // loop through the minutes array
        for (var j = 0; j < mins.length; j++) {
            // initialize variables
            let elem = "#" + txt + "-" + mins[j],
                entryMin = parseInt(mins[j]);
            // if/else statement to set classes depending on the time
            if (currentHour == hour && currentSetting == "pm") {
                if (hour != "9" && hour != "10" && hour != "11" && hour != "12") {
                    if (currentMinute >= 0 && currentMinute < 15) {
                        if (entryMin === 0) {
                            $(elem).addClass("current-entry");
                        } else {
                            $(elem).addClass("future-entry");
                        }
                    } else if (currentMinute >= 15 && currentMinute < 30) {
                        if (entryMin === 15) {
                            $(elem).addClass("current-entry");
                        } else if (entryMin === 0) {
                            $(elem).addClass("past-entry");
                        } else {
                            $(elem).addClass("future-entry");
                        }
                    } else if (currentMinute >= 30 && currentMinute < 45) {
                        if (entryMin === 30) {
                            $(elem).addClass("current-entry");
                        } else if (entryMin === 0) {
                            $(elem).addClass("past-entry");
                        } else if (entryMin === 15) {
                            $(elem).addClass("past-entry");
                        } else {
                            $(elem).addClass("future-entry");
                        }
                    } else if (currentMinute >= 45 && currentMinute < 60) {
                        if (entryMin === 45) {
                            $(elem).addClass("current-entry");
                        } else if (entryMin === 0) {
                            $(elem).addClass("past-entry");
                        } else if (entryMin === 15) {
                            $(elem).addClass("past-entry");
                        } else if (entryMin === 30) {
                            $(elem).addClass("past-entry");
                        } else {
                            $(elem).addClass("future-entry");
                        }
                    }
                }
            } else if (currentHour == hour && currentSetting == "am") {
                if (currentMinute >= 0 && currentMinute < 15) {
                    if (entryMin === 0) {
                        $(elem).addClass("current-entry");
                    } else {
                        $(elem).addClass("future-entry");
                    }
                } else if (currentMinute >= 15 && currentMinute < 30) {
                    if (entryMin === 15) {
                        $(elem).addClass("current-entry");
                    } else if (entryMin === 0) {
                        $(elem).addClass("past-entry");
                    } else {
                        $(elem).addClass("future-entry");
                    }
                } else if (currentMinute >= 30 && currentMinute < 45) {
                    if (entryMin === 30) {
                        $(elem).addClass("current-entry");
                    } else if (entryMin === 0) {
                        $(elem).addClass("past-entry");
                    } else if (entryMin === 15) {
                        $(elem).addClass("past-entry");
                    } else {
                        $(elem).addClass("future-entry");
                    }
                } else if (currentMinute >= 45 && currentMinute < 60) {
                    if (entryMin === 45) {
                        $(elem).addClass("current-entry");
                    } else if (entryMin === 0) {
                        $(elem).addClass("past-entry");
                    } else if (entryMin === 15) {
                        $(elem).addClass("past-entry");
                    } else if (entryMin === 30) {
                        $(elem).addClass("past-entry");
                    } else {
                        $(elem).addClass("future-entry");
                    }
                }
            } else if (currentHour > hour) {
                $(elem).addClass("past-entry");
            } else if (currentHour < hour) {
                if (hour === 9) {
                    $(elem).addClass("past-entry");
                } else if (hour === 10) {
                    $(elem).addClass("past-entry");
                } else if (hour === 11) {
                    $(elem).addClass("past-entry");
                } else if (hour === 12) {
                    $(elem).addClass("past-entry");
                } else {
                    $(elem).addClass("future-entry");
                }
            } 
        }
    }
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
            let combinedArr = existingEntries.concat(newArr);
            localStorage.setItem("SchedulerTasks", JSON.stringify(combinedArr));
        }
    } else {
      // save to local storage
      localStorage.setItem("SchedulerTasks", JSON.stringify(newArr));
    }
}