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
    let date = dayjs(new Date()).format('ddd MMM D, YYYY');
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
    // if ID exists, remove the object from the local storage array and update
    if (entryIdx > -1) {
        // splice at the selected index
        existingEntries.splice(entryIdx, 1);
        // update local storage
        localStorage.setItem("SchedulerTasks", JSON.stringify(existingEntries));
        // set focus to the text area that was just deleted
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
            scheduler = $("<div class=\"scheduler\" id=\"" + text + "\"></div>");
        // append the hour to the scheduler entry
        $(hourWrapper).append("<h2>" + hour + "</h2>");
        // for each minute listed in the array, append a new li with a form, text area and two buttons
        for (let j = 0; j < schedulerTimes[i].mins.length; j++) {
            // initiallize variables
            let min = schedulerTimes[i].mins[j];
            // append the list items
            $(minList).append("<li>" + min + "</li>");
            $(entryList).append("<li><form id=\"form-" + text + "-" + min + "\" onsubmit=\"saveEntry(this);return false\"><label for=\"" + text + "-" + min + "\" class=\"screen-reader\">" + hour + ":" + min + "</label><textarea id=\"" + text + "-" + min + "\" name=\"" + text + "-" + min + "\" rows=\"4\" cols=\"25\" required></textarea><div class=\"btn-wrapper\"><button type=\"button\" id=\"btn-" + text + "-" + min + "\" onclick=\"clearEntry(this)\">Clear <i class=\"fa-solid fa-trash\"></i></button><button type=\"submit\">Save <i class=\"fa-solid fa-floppy-disk\"></i></button></div></form></li>");
        }
        // append the items to the page
        $(minWrapper).append(minList);
        $(entriesWrapper).append(entryList);
        $(scheduler).append(hourWrapper);
        $(scheduler).append(minWrapper);
        $(scheduler).append(entriesWrapper);
        $(".scheduler-wrapper").append(scheduler);
    }
    // fires once function completes to run the next function
    callback();
}
/**
 * @checkEntryMinutes
 * sets class depending on the current minute(s)
 */
function checkEntryMinutes(currentMinute,entryMin,elem) {
    // if currentMinute is between 0 and 15, set 0 to current and the rest to future
    if (currentMinute >= 0 && currentMinute < 15) {
        if (entryMin === 0) {
            addRemoveClasses(elem,"past-entry","future-entry","current-entry");
        } else {
            addRemoveClasses(elem,"past-entry","current-entry","future-entry");
        }
    } 
    // if currentMinute is between 15 and 30, set 0 to past, 15 to current, and the rest to future
    else if (currentMinute >= 15 && currentMinute < 30) {
        if (entryMin === 15) {
            addRemoveClasses(elem,"past-entry","future-entry","current-entry");
        } else if (entryMin === 0) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } else {
            addRemoveClasses(elem,"past-entry","current-entry","future-entry");
        }
    }
    // if currentMinute is between 30 and 45, set 0 and 15 to past, 30 to current, and the rest to future 
    else if (currentMinute >= 30 && currentMinute < 45) {
        if (entryMin === 30) {
            addRemoveClasses(elem,"past-entry","future-entry","current-entry");
        } else if (entryMin === 0) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } else if (entryMin === 15) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } else {
            addRemoveClasses(elem,"past-entry","current-entry","future-entry");
        }
    }
    // if currentMinute is between 45 and 60, set 0, 15 and 30 to past, and 45 to current
    else if (currentMinute >= 45 && currentMinute < 60) {
        if (entryMin === 45) {
            addRemoveClasses(elem,"past-entry","future-entry","current-entry");
        } else if (entryMin === 0) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } else if (entryMin === 15) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } else if (entryMin === 30) {
            addRemoveClasses(elem,"current-entry","future-entry","past-entry");
        } 
    }
}/**
 * @addRemoveClasses
 * sets background color of text blocks
 * if time is in past, present or future
 */
function addRemoveClasses(element,removeClass1,removeClass2,addClass1) {
    // remove class 1
    $(element).removeClass(removeClass1);
    // remove class 2
    $(element).removeClass(removeClass2);
    // add class 1
    $(element).addClass(addClass1);
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
        currentMinute = currentTime.substring(currentTime.lastIndexOf(':')+1),
        pmArr = ["6","7","8","9","10","11"],
        amArr = ["12","1","2","3","4","5","6","7","8"];
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
            // if it is PM and after 6 set all entries to past-entry
            if (pmArr.indexOf(currentHour) !== -1 && currentSetting == "pm") {
                addRemoveClasses(elem,"current-entry","future-entry","past-entry");
            } 
            // if it is AM and before 9 set all entries to past-entry
            else if (amArr.indexOf(currentHour) !== -1 && currentSetting == "am") {
                addRemoveClasses(elem,"current-entry","future-entry","past-entry");
            } 
            // else, it is AM or PM between the hours of 9am and 5pm
            else {
                // current afternoon entries
                if (currentHour == hour && currentSetting == "pm") {
                    if (currentHour == 12 && hour == 12) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 1 && hour == 1) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 2 && hour == 2) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 3 && hour == 3) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 4 && hour == 4) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 5 && hour == 5) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else {
                        addRemoveClasses(elem,"current-entry","future-entry","past-entry");
                    }
                // current morning entries
                } else if (currentHour == hour && currentSetting == "am") {
                    if (currentHour == 9 && hour == 9) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 10 && hour == 10) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 11 && hour == 11) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else if (currentHour == 12 && hour == 12) {
                        checkEntryMinutes(currentMinute,entryMin,elem);
                    } else {
                        addRemoveClasses(elem,"current-entry","future-entry","past-entry");
                    }
                // currentHour is greater than the current iterated hour in the array
                } else if (currentHour > hour) {
                    // in the AM, add future-entry class to hours 1-5
                    if ((currentHour == 9 || currentHour == 10 || currentHour == 11 || currentHour == 12) && (hour == 1 || hour == 2 || hour == 3 || hour == 4 || hour == 5)) {
                        addRemoveClasses(elem,"past-entry","current-entry","future-entry");
                    } 
                    // if currentHour is 2, set hour 1 to past
                    else if (currentHour == 2 && hour == 1) {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    } 
                    // if currentHour is 3, set hour 2 to past
                    else if (currentHour == 3 && hour == 2) {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    } 
                    // if currentHour is 4, set hour 3 to past
                    else if (currentHour == 4 && hour == 3) {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    } 
                    // if currentHour is 5, set hour 4 to past
                    else if (currentHour == 5 && hour == 4) {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    } 
                    // for everything else, set class to past-entry
                    else {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    }
                // currentHour is less than the current iterated hour in the array
                } else if (currentHour < hour) { 
                    // if currentHour is 1-5 and iterated hour from array is 9-12, set past entry on 9-2
                    if ((currentHour == 1 || currentHour == 2 || currentHour == 3 || currentHour == 4 || currentHour == 5) && (hour == 9 || hour == 10 || hour == 11 || hour == 12)) {
                        addRemoveClasses(elem,"future-entry","current-entry","past-entry");
                    } 
                    // else set class future-entry
                    else {
                        addRemoveClasses(elem,"past-entry","current-entry","future-entry");
                    }
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
    // initialize variables
    let existingEntries = JSON.parse(localStorage.getItem("SchedulerTasks"));
    // if local storage exists
    if (existingEntries) {
        // for each object in the array, update the text area with the saved value for the specified ID
        for (let i = 0; i < existingEntries.length; i++) {
            // initialize variables
            let elemId = existingEntries[i].id,
                elemVal = existingEntries[i].val;
            // update value
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
        entriesObj = { id: elemId, val: entryVal },
        successMsg = document.getElementById("success-msg");
    // create a new entry object
    newArr.push(entriesObj);
    // if local storage exists
    if (existingEntries) {
        // check if ID already exists
        let existingEntry = existingEntries.find(a => a.id === elemId);
        // if ID exists, update the specific value
        if (existingEntry) {
            // initialize variables
            let existingId = existingEntry.id;
            // if key already exists in the array, target that ID and update the value to override the saved data
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
    // success message that displays when user clicks the save button
    successMsg.textContent = "Entry saved to local storage!";
    // after 3 seconds, hide the message
    setTimeout(() => {
        // empty the text
        successMsg.textContent = "";
    }, "3000");
}