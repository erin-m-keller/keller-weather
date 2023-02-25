let cityName = "Detroit",
    fiveDayForecastArr = [],
    cityTimezone,
    apiKey = "e69b9e2eef69c1c5006d043926d24dd0",
    citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey,
    fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;

$(window).on("resize", function() {
    let winWidth = $(this).width();
    if (winWidth < 700) {
        document.getElementById("side-bar").style.marginLeft = "-16em";
    } else if (winWidth > 700) {
        document.getElementById("side-bar").style.marginLeft = "0";
    }
});
function init () {
    buildSearchHistory();
    fetchCurrentCityData(citySearchUrl);
    fetchFiveDayForecastData(fiveDayForecastUrl);
    document.getElementById("search-form").addEventListener("submit", searchCity);
}
init();
function toggleNav() {
    let isActive = $(".navbar-burger").hasClass("is-active");
    if (isActive) {
        $(".navbar-burger").removeClass("is-active");
        document.getElementById("side-bar").style.marginLeft = "-16em";
    } else {
        $(".navbar-burger").addClass("is-active");
        document.getElementById("side-bar").style.marginLeft = "0";
    }
}
function formatCity(city) {
    var cityStr = city.toLowerCase().split(' ');
    for (var i = 0; i < cityStr.length; i++) {
        cityStr[i] = cityStr[i].charAt(0).toUpperCase() + cityStr[i].substring(1);     
    }
    return cityStr.join(' '); 
 }
function buildSearchHistory(numOfItems) {
    let searchPanel = $(".search-history"),
    searchStorage = JSON.parse(localStorage.getItem("SearchedCities"));
    searchPanel.empty();
    if (searchStorage) {
        if (searchStorage.length > 1) {
            for (var i = 0; i < searchStorage.length; i++) {
                let cityName = searchStorage[i];
                searchPanel.append("<a class=\"panel-block\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + cityName + "</a>");
            }
        } else {
            searchPanel.append("<a class=\"panel-block\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + searchStorage + "</a>");
        }
    }
}
function searchCity(e) {
    let cityName = formatCity($("#search-input").val()),
        cityUrlParam = $("#search-input").val().replace(/ /g, '+'),
        searchArr = [],
        searchStorage = JSON.parse(localStorage.getItem("SearchedCities"));
    e.preventDefault();
    if (searchStorage) {
        let alreadyExists = jQuery.inArray(cityName, searchStorage);
        if (alreadyExists == -1) {
            searchStorage.unshift(cityName);
            localStorage.setItem("SearchedCities",JSON.stringify(searchStorage));
            buildSearchHistory();
        }
    } else {
        searchArr.push(cityName);
        localStorage.setItem("SearchedCities",JSON.stringify(searchArr));
        buildSearchHistory();
    }
    $('#search-input').val('');
    getCityData();
}
function buildCurrentCityContent(currentData) {
    cityTimezone = currentData.timezone;
    let currentCityData = currentData,
        sunriseTimestamp = currentCityData.sys.sunrise,
        sunsetTimestamp = currentCityData.sys.sunset,
        currentSunrise = moment.utc(sunriseTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
        currentSunset = moment.utc(sunsetTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a');
    
    $(".city-name").append("<strong>" + currentCityData.name + "<strong>");
    $(".city-temp").append("<strong>Current Temperature:</strong> " + currentCityData.main.temp.toFixed() + "°");
    $(".city-feelslike").append("<strong>Feels Like:</strong> " + currentCityData.main.feels_like.toFixed() + "°");
    $(".city-humidity").append("<strong>Current Humidity:</strong> " + currentCityData.main.humidity + "%");
    $(".city-wind").append("<strong>Current Wind Speed:</strong> " + currentCityData.wind.speed.toFixed() + " MPH");
    $(".city-sunrise").append("<strong>Sunrise:</strong> " + currentSunrise + "&nbsp;&nbsp;<i class=\"fa fa-regular fa-sun\"></i>");
    $(".city-sunset").append("<strong>Sunset:</strong> " + currentSunset + "&nbsp;&nbsp;<i class=\"fa-regular fa-moon\"></i>");
    $(".weather-condition").attr("src", "https://openweathermap.org/img/wn/" + currentCityData.weather[0].icon + "@2x.png");
}
function buildFiveDayForecastContent(currentData) {
    let fiveDayForecastList = currentData.list;
    for (let i = 0; i < fiveDayForecastList.length; i++) {
        let weatherTimestamp = fiveDayForecastList[i].dt,
            daysDate = new Date(weatherTimestamp * 1000).toLocaleDateString("en-US"),
            daysTime = moment.utc(weatherTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
            daysTemp = fiveDayForecastList[i].main.temp.toFixed(),
            daysHumidity = fiveDayForecastList[i].main.humidity,
            weatherIcon = fiveDayForecastList[i].weather[0].icon,
            iconAlt = fiveDayForecastList[i].weather[0].main,
            forecastDayObj = {
                date: daysDate,
                temp: daysTemp,
                time: daysTime,
                humidity: daysHumidity,
                icon: weatherIcon,
                iconAlt: iconAlt

            };
            fiveDayForecastArr.push(forecastDayObj);
            $("#forecast-wrapper").append("<div class=\"forecast-tile\"><article class=\"danger\"><figure><img src=\"https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\" alt=\"" + iconAlt + "\"></figure><p class=\"tile-txt\">" + daysDate + "</p><p class=\"tile-txt\">Temperature: " + daysTemp + "°</p><p class=\"tile-txt\">Humidity: " + daysHumidity + "%</p></article></div>");
    }
}
async function fetchCurrentCityData (url) {
    let currentCityData;
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                currentCityData = data;
                buildCurrentCityContent(currentCityData);
            })
        } else {
            console.log(res);
        }
    })
}
async function fetchFiveDayForecastData (url) {
    let currentFiveDayForecastData;
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                currentFiveDayForecastData = data;
                buildFiveDayForecastContent(currentFiveDayForecastData);
            })
        } else {
            console.log(res);
        }
    })
}