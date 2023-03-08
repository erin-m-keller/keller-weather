// initialize global variables
let cityTimezone,
    geoLocationApiKey = "e054ba02011d4c6290cedbdf89c0171e",
    openWeatherApiKey = "e69b9e2eef69c1c5006d043926d24dd0",
    reverseGeocodingApiKey = "d71d84f58a764df2ab54edb4bf6068db";
// if window screen is less than 700px, close the sidebar 
if (window.matchMedia("(max-width:700px)").matches) {
    $("#side-bar").css("margin-left","-16em");
}
// if window screen is less than 700px on resize, close the sidebar 
$(window).on("resize", function() {
    let winWidth = $(this).width();
    if (winWidth < 700) {
        $("#side-bar").css("margin-left","-16em");
    } else if (winWidth > 700) {
        $("#side-bar").css("margin-left","0");
    }
});
// event listener for form submit
$( "#search-form" ).submit(function(e) {
    // prevent default behavior
    e.preventDefault();
    // search the city from the form
    formSearchCity(e);
});
/**
 * @init
 * runs on page load
 */
function init () {
    // build the search history
    buildSearchHistory();
    // if geolocation api is available, get users current location
    if ("geolocation" in navigator) {
        let options = { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } 
    // else display detroit when api is not available
    else {
        let url = buildCityUrl("Detroit");
        getCurrentCityData(url,"Detroit");
    }
}
// run init function
init();
/**
 * @successCallback
 * position from api is appended to the url and 
 * passed to the @getCurrentLatLonData function
 */
function successCallback (position) {
    // initialize variables
    let citySearchLatLonUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=imperial&appid=" + openWeatherApiKey;
    // fetch data based on latitude and longitude
    getCurrentLatLonData(citySearchLatLonUrl);
};
/**
 * @errorCallback
 * when there is an error with the geolocation
 * api, set Detroit as default city and then
 * display the error message for 5 seconds
 */
function errorCallback () {
    // initialize variables
    let url = buildCityUrl("Detroit");
    // fetch data on detroit
    getCurrentCityData(url,"Detroit");
    // show the error message
    $(".geolocation-error").removeClass("inactive").addClass("is-active");
    // after 5 seconds, hide the error message
    setTimeout(function() {
        // hide the error message
        $(".geolocation-error").removeClass("is-active").addClass("inactive");
    }, 5000);
};
/**
 * @toggleNav
 * toggles the side panel on mobile devices
 */
function toggleNav() {
    // initialize variables
    let isActive = $(".navbar-burger").hasClass("is-active");
    // if the navbar hamburger is active
    if (isActive) {
        // remove is-active class
        $(".navbar-burger").removeClass("is-active");
        // hide the side bar
        $("#side-bar").css("margin-left","-16em");
    } 
    // if the navbar hamburger is inactive
    else {
        // add the is-active class
        $(".navbar-burger").addClass("is-active");
        // show the side panel
        $("#side-bar").css("margin-left","0");
    }
}
/**
 * @buildCityUrl
 * accepts cityName parameter to build the
 * correct API url for the data
 */
function buildCityUrl (cityName) {
    // initialize variables
    let citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + openWeatherApiKey;
    // return the api url
    return citySearchUrl;

}
/**
 * @buildFiveDayUrl
 * accepts cityName parameter to build the
 * correct API url for the data
 */
function buildFiveDayUrl (cityName) {
    // initialize variables
    let fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + openWeatherApiKey;
    // return the api url
    return fiveDayForecastUrl;
}
/**
 * @formatCity
 * capitalized the first letter of each search term
 */
function formatCity(city) {
    // initialize variables
    let cityArr = city.toLowerCase().split(' ');
    // for each word in the array
    for (let i = 0; i < cityArr.length; i++) {
        // capitalize the current string
        cityArr[i] = cityArr[i].charAt(0).toUpperCase() + cityArr[i].substring(1);     
    }
    // concatenate the words into one string and return
    return cityArr.join(' '); 
}
/**
 * @buildSearchHistory
 * builds the sidepanel with the 
 * cities previously searched
 */
function buildSearchHistory() {
    // initialize variables
    let searchPanel = $(".search-history"),
        searchStorage = JSON.parse(localStorage.getItem("SearchedCities"));
    // empty the panel before appending
    searchPanel.empty();
    // if searched cities exist in local storage
    if (searchStorage) {
        // if more than one city exists
        if (searchStorage.length > 1) {
            // loop through each city in local storage
            for (var i = 0; i < searchStorage.length; i++) {
                // initialize variables
                let cityName = searchStorage[i];
                // append the city to the side panel
                searchPanel.append("<a class=\"panel-block\" onclick=\"anchorSearchCity(this)\" value=\"" + cityName + "\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + cityName + "</a>");
            }
        } 
        // if only one city exists
        else {
            // append the city to the side panel
            searchPanel.append("<a class=\"panel-block\" onclick=\"anchorSearchCity(this)\" value=\"" + searchStorage + "\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + searchStorage + "</a>");
        }
    }
}
/**
 * @addCityToStorage
 * adds the currently searched city
 * to local storage
 */
function addCityToStorage(searchedCity) {
    // initialize variables
    let searchStorage = JSON.parse(localStorage.getItem("SearchedCities")),
        searchArr = [];
    // if there are cities in local storage
    if (searchStorage) {
        // initialize variables
        let alreadyExists = jQuery.inArray(searchedCity, searchStorage);
        // if the city does not exist in local storage
        if (alreadyExists == -1) {
            // push the searched city to the top of the list
            searchStorage.unshift(searchedCity);
            // update local storage
            localStorage.setItem("SearchedCities",JSON.stringify(searchStorage));
            // call the @buildSearchHistory function
            buildSearchHistory();
        }
    // there are no cities in local storage
    } else {
        // push the city to the empty array
        searchArr.push(searchedCity);
        // update local storage 
        localStorage.setItem("SearchedCities",JSON.stringify(searchArr));
        // call the @buildSearchHistory function
        buildSearchHistory();
    }
}
/**
 * @formSearchCity
 * The user searched for a city using
 * the form on the page, the function
 * formats the city name, builds the api
 * url and fetches the current city data
 */
function formSearchCity(e) {
    // initialize variables
    let searchedCity = formatCity($("#search-input").val()),
        cityUrlParam = searchedCity.replace(/ /g, '+'),
        cityUrl = buildCityUrl(cityUrlParam);
    // prevent default behavior
    e.preventDefault();
    // fetch current city data
    getCurrentCityData(cityUrl,searchedCity);
    // empty the form text input
    $('#search-input').val('');
}
/**
 * @formSearchCity
 * The user searched for a city by
 * clicking the city name in the side panel, 
 * the function formats the city name, builds 
 * the api url and fetches the current city data
 */
function anchorSearchCity(e) {
    // initialize variables
    let searchedCity = formatCity(e.getAttribute('value')),
        cityUrlParam = searchedCity.replace(/ /g, '+'),
        cityUrl = buildCityUrl(cityUrlParam);
    // fetch current city data
    getCurrentCityData(cityUrl,searchedCity);
}
/**
 * @buildCurrentCityContent
 * This function assigns the various
 * weather data that is available and 
 * appends the content to the page. 
 * It also calls @getLocalTime @getUvIndex 
 * and @fetchFiveDayForecast 
 */
function buildCurrentCityContent(currentData) {
    // assign the global variable
    cityTimezone = currentData.timezone;
    // initialize the variables
    let currentCityData = currentData,
        cityName = currentData.name,
        sunriseTimestamp = currentCityData.sys.sunrise,
        sunsetTimestamp = currentCityData.sys.sunset,
        currentSunrise = moment.utc(sunriseTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
        currentSunset = moment.utc(sunsetTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
        longitude = currentCityData.coord.lon,
        latitude = currentCityData.coord.lat,
        uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + openWeatherApiKey,
        fiveDayUrl = buildFiveDayUrl(cityName);
    // call function to get local time based on latitude and longitude
    getLocalTime(latitude,longitude);
    // call the function to get the UV index based on latitude and longitude
    getUvIndex(uvIndexUrl);
    // call the function to populate the 5-day forcast
    getFiveDayForecastData(fiveDayUrl);
    // empty the page elements before appending the content
    $(".city-name,.city-temp,.city-feelslike,.city-humidity,.city-wind,.city-sunrise,.city-sunset").empty();
    // append the data to the page
    $(".city-name").append("<strong>" + currentCityData.name + "<strong>");
    $(".city-temp").append("<strong>Current Temperature:</strong> " + currentCityData.main.temp.toFixed() + "°");
    $(".city-feelslike").append("<strong>Feels Like:</strong> " + currentCityData.main.feels_like.toFixed() + "°");
    $(".city-humidity").append("<strong>Current Humidity:</strong> " + currentCityData.main.humidity + "%");
    $(".city-wind").append("<strong>Current Wind Speed:</strong> " + currentCityData.wind.speed.toFixed() + " MPH");
    $(".city-sunrise").append("<strong>Sunrise:</strong> " + currentSunrise + "&nbsp;&nbsp;<i class=\"fa fa-regular fa-sun\"></i>");
    $(".city-sunset").append("<strong>Sunset:</strong> " + currentSunset + "&nbsp;&nbsp;<i class=\"fa-regular fa-moon\"></i>");
    $(".weather-condition").attr("src", "https://openweathermap.org/img/wn/" + currentCityData.weather[0].icon + "@2x.png");
}
/**
 * @buildFiveDayForecastContent
 * This function assigns the various
 * weather data that is available and 
 * appends the content to the page.
 */
function buildFiveDayForecastContent(currentData) {
    // initialize variables
    let fiveDayForecastList = currentData.list;
    // empty the wrapper before appending content
    $("#forecast-wrapper").empty();
    // for each object in the array
    for (let i = 0; i < fiveDayForecastList.length; i++) {
        // initialize variables
        let weatherTimestamp = fiveDayForecastList[i].dt,
            daysDate = new Date(weatherTimestamp * 1000).toLocaleDateString("en-US"),
            daysTime = moment.utc(weatherTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
            daysTemp = fiveDayForecastList[i].main.temp.toFixed(),
            daysHumidity = fiveDayForecastList[i].main.humidity,
            daysWind = fiveDayForecastList[i].wind.speed.toFixed() + " MPH",
            weatherIcon = fiveDayForecastList[i].weather[0].icon,
            iconAlt = fiveDayForecastList[i].weather[0].main;
        // if time is either 2pm, 3pm, or 4pm then append the content to the page
        if (daysTime == "2:00 pm" || daysTime == "3:00 pm" || daysTime == "4:00 pm") {
            $("#forecast-wrapper").append("<div class=\"forecast-tile\"><article class=\"danger\"><figure><img src=\"https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\" alt=\"" + iconAlt + "\"></figure><p class=\"tile-txt\">" + daysDate + "</p><p class=\"tile-txt\">Temperature: " + daysTemp + "°</p><p class=\"tile-txt\">Humidity: " + daysHumidity + "%</p><p class=\"tile-txt\">Wind Speed: " + daysWind + "</p></article></div>");
            $(".loading-wrapper").removeClass("is-active").addClass("inactive");
            $(".main-content").removeClass("inactive").addClass("is-active");
        } 
    }
}
/**
 * @clearSearch
 * Remove searched cities from
 * local storage
 */
function clearSearch() {
    // remove SearchedCities from local storage
    localStorage.removeItem("SearchedCities");
    // empty the search history
    $(".search-history").empty();
}
/**
 * @cityNotFound
 * Displays an error message to the user
 * when a city is not valid
 */
function cityNotFound() {
    // add active class to display message
    $(".not-found").removeClass("inactive").addClass("is-active");
    // runs in 5 seconds
    setTimeout(function() {
        // remove active class to hide message
        $(".not-found").removeClass("is-active").addClass("inactive");
    }, 5000);
}
/**
 * @getUvIndex
 * calls uv index api to display
 * on the page. Changes tag color 
 * depending on severity of index
 */
function getUvIndex(url) {
    // GET call
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (data) {
        // initialize variables
        let uvIdx = data.value,
            uvClass = "";
        // if less than or equal to 4, color is green
        if (uvIdx <= 4) {
            uvClass = " is-primary";
        } 
        // if between 4 and 7, color is yellow
        else if (uvIdx > 4 && uvIdx < 7) {
            uvClass = " is-warning";
        } 
        // if greater than 8, color is red
        else {
            uvClass = " is-danger";
        }
        // empty container before appending
        $(".uv-index").empty();
        // append the uv index to the page
        $(".uv-index").append("<strong>UV Index:</strong>&nbsp;&nbsp;<span class=\"tag" + uvClass + "\">" + uvIdx + "</span>");
    }).fail(function () {
        // error
        console.log("Could not get data")
    });
}
/**
 * @getCurrentLatLonData
 * gets the data for a city based on
 * latitude and longitude. Calls 
 * @buildCurrentCity function or
 * @cityNotFound function dependent 
 * on the response
 */
function getCurrentLatLonData(url) {
    // GET call
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (data) {
        // initialize variables
        let currentCityData = data;
        // call @buildCurrentCityContent function
        buildCurrentCityContent(currentCityData);
    }).fail(function (jqXHR,textStatus,errorThrown) {
        // error status response is 404
        if (jqXHR.status == "404") {
            // call @cityNotFound function
            cityNotFound();
        }
        // status log
        console.log("status: " + textStatus);
        // error log
        console.log("error thrown: " + errorThrown);
    });
}
/**
 * @getCurrentCityData
 * gets the data for a city based on
 * city name. Calls @buildCurrentCity 
 * function or @cityNotFound function 
 * dependent on the response
 */
function getCurrentCityData(url,city) {
    // GET call
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (data) {
        // initialize variables
        let currentCityData = data;
        // call @addCityToStorage function
        addCityToStorage(city);
        // call @buildCurrentCityContent function
        buildCurrentCityContent(currentCityData);
    }).fail(function (jqXHR,textStatus,errorThrown) {
        // error status response is 404
        if (jqXHR.status == "404") {
            // call @cityNotFound function
            cityNotFound();
        }
        // status log
        console.log("status: " + textStatus);
        // error log
        console.log("error thrown: " + errorThrown);
    });
}
/**
 * @getFiveDayForecastData
 * gets the 5-day forecast for a city 
 * based on city name. Calls 
 * @buildFiveDayForecastContent 
 */
function getFiveDayForecastData(url) {
    // GET call
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (data) {
        // assign the data to a variable
        let currentFiveDayForecastData = data;
        // call @buildFiveDayForecastContent function
        buildFiveDayForecastContent(currentFiveDayForecastData);
    }).fail(function (jqXHR,textStatus,errorThrown) {
        // status code log
        console.log("status code: " + jqXHR.status);
        // status log
        console.log("status: " + textStatus);
        // error log
        console.log("error thrown: " + errorThrown);
    });
}
/**
 * @getLocalTime
 * Uses API to get timezone of user
 * based on latitude and longitude. Then
 * moment-timezone converts the time to
 * a readable format
 */
function getLocalTime(latitude,longitude) {
    // initialize variables
    let url = "https://api.geoapify.com/v1/geocode/reverse?lat=" + latitude + "&lon=" + longitude + "&apiKey=" + reverseGeocodingApiKey;
    // GET call
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (data) {
        // initialize variables
        let timezone = data.features[0].properties.timezone.name,
            localTime = moment().tz(timezone).format('h:mm a');
        // empty the element before appending
        $(".city-time").empty();
        // append the local time to the page
        $(".city-time").append("<strong>Local Time:</strong> " + localTime);
    }).fail(function (jqXHR,textStatus,errorThrown) {
        // status code log
        console.log("status code: " + jqXHR.status);
        // status log
        console.log("status: " + textStatus);
        // error log
        console.log("error thrown: " + errorThrown);
    });
}