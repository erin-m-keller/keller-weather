let cityTimezone,
    geoLocationApiKey = "e054ba02011d4c6290cedbdf89c0171e",
    openWeatherApiKey = "e69b9e2eef69c1c5006d043926d24dd0",
    reverseGeocodingApiKey = "d71d84f58a764df2ab54edb4bf6068db";
$(window).on("resize", function() {
    let winWidth = $(this).width();
    if (winWidth < 700) {
        $("#side-bar").css("margin-left","-16em");
    } else if (winWidth > 700) {
        $("#side-bar").css("margin-left","0");
    }
});
$( "#search-form" ).submit(function(e) {
    e.preventDefault();
    formSearchCity(e);
});
function init () {
    buildSearchHistory();
    if ("geolocation" in navigator) {
        let options = { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } 
    else {
        let url = buildCityUrl("Detroit");
        fetchCurrentCityData(url,"Detroit");
    }
}
init();
function successCallback (position) {
    let citySearchLatLonUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=imperial&appid=" + openWeatherApiKey;
    fetchCurrentLatLonData(citySearchLatLonUrl);
};
function errorCallback (error) {
    let url = buildCityUrl("Detroit");
    fetchCurrentCityData(url,"Detroit");
    $(".geolocation-error").removeClass("inactive").addClass("is-active");
    setTimeout(function() {
        $(".geolocation-error").removeClass("is-active").addClass("inactive");
    }, 5000);
};
function toggleNav() {
    let isActive = $(".navbar-burger").hasClass("is-active");
    if (isActive) {
        $(".navbar-burger").removeClass("is-active");
        $("#side-bar").css("margin-left","-16em");
    } else {
        $(".navbar-burger").addClass("is-active");
        $("#side-bar").css("margin-left","0");
    }
}
function buildCityUrl (cityName) {
    let citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + openWeatherApiKey;
    return citySearchUrl;

}
function buildFiveDayUrl (cityName) {
    let fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + openWeatherApiKey;
    return fiveDayForecastUrl;
}
function formatCity(city) {
    let cityStr = city.toLowerCase().split(' ');
    for (let i = 0; i < cityStr.length; i++) {
        cityStr[i] = cityStr[i].charAt(0).toUpperCase() + cityStr[i].substring(1);     
    }
    return cityStr.join(' '); 
 }
function buildSearchHistory() {
    let searchPanel = $(".search-history"),
        searchStorage = JSON.parse(localStorage.getItem("SearchedCities"));
    searchPanel.empty();
    if (searchStorage) {
        if (searchStorage.length > 1) {
            for (var i = 0; i < searchStorage.length; i++) {
                let cityName = searchStorage[i];
                searchPanel.append("<a class=\"panel-block\" onclick=\"anchorSearchCity(this)\" value=\"" + cityName + "\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + cityName + "</a>");
            }
        } else {
            searchPanel.append("<a class=\"panel-block\" onclick=\"anchorSearchCity(this)\" value=\"" + searchStorage + "\"><span class=\"panel-icon\"><i class=\"fas fa-duotone fa-city\" aria-hidden=\"true\"></i></span>" + searchStorage + "</a>");
        }
    }
}
function addCityToStorage (searchedCity) {
    let searchStorage = JSON.parse(localStorage.getItem("SearchedCities")),
        searchArr = [];
    if (searchStorage) {
        let alreadyExists = jQuery.inArray(searchedCity, searchStorage);
        if (alreadyExists == -1) {
            searchStorage.unshift(searchedCity);
            localStorage.setItem("SearchedCities",JSON.stringify(searchStorage));
            buildSearchHistory();
        }
    } else {
        searchArr.push(searchedCity);
        localStorage.setItem("SearchedCities",JSON.stringify(searchArr));
        buildSearchHistory();
    }
}
function formSearchCity(e) {
    let searchedCity = formatCity($("#search-input").val()),
        cityUrlParam = searchedCity.replace(/ /g, '+'),
        cityUrl = buildCityUrl(cityUrlParam);
    cityName = cityUrlParam;
    e.preventDefault();
    fetchCurrentCityData(cityUrl,searchedCity);
    $('#search-input').val('');
}
function anchorSearchCity(e) {
    let searchedCity = formatCity(e.getAttribute('value')),
        cityUrlParam = searchedCity.replace(/ /g, '+'),
        cityUrl = buildCityUrl(cityUrlParam);
    cityName = cityUrlParam;
    fetchCurrentCityData(cityUrl,searchedCity);
}
function buildCurrentCityContent(currentData) {
    cityTimezone = currentData.timezone;
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
    getLocalTime(latitude,longitude);
    getUvIndex(uvIndexUrl);
    fetchFiveDayForecastData(fiveDayUrl);
    $(".city-name,.city-temp,.city-feelslike,.city-humidity,.city-wind,.city-sunrise,.city-sunset").empty();
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
    $("#forecast-wrapper").empty();
    for (let i = 0; i < fiveDayForecastList.length; i++) {
        let weatherTimestamp = fiveDayForecastList[i].dt,
            daysDate = new Date(weatherTimestamp * 1000).toLocaleDateString("en-US"),
            daysTime = moment.utc(weatherTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
            daysTemp = fiveDayForecastList[i].main.temp.toFixed(),
            daysHumidity = fiveDayForecastList[i].main.humidity,
            weatherIcon = fiveDayForecastList[i].weather[0].icon,
            iconAlt = fiveDayForecastList[i].weather[0].main;
            if (daysTime == "2:00 pm" || daysTime == "3:00 pm" || daysTime == "4:00 pm") {
                $("#forecast-wrapper").append("<div class=\"forecast-tile\"><article class=\"danger\"><figure><img src=\"https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png\" alt=\"" + iconAlt + "\"></figure><p class=\"tile-txt\">" + daysDate + "</p><p class=\"tile-txt\">Temperature: " + daysTemp + "°</p><p class=\"tile-txt\">Humidity: " + daysHumidity + "%</p></article></div>");
                $(".loading-wrapper").removeClass("is-active").addClass("inactive");
                $(".main-content").removeClass("inactive").addClass("is-active");
            } 
    }
}
function clearSearch() {
    localStorage.removeItem("SearchedCities");
    $(".search-history").empty();
}
function cityNotFound() {
    $(".not-found").removeClass("inactive").addClass("is-active");
    setTimeout(function() {
        $(".not-found").removeClass("is-active").addClass("inactive");
    }, 5000);
}
async function getUvIndex (url) {
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                let uvIdx = data.value,
                    uvClass = "";
                if (uvIdx <= 4) {
                    uvClass = " is-primary";
                } else if (uvIdx > 4 && uvIdx < 7) {
                    uvClass = " is-warning";
                } else {
                    uvClass = " is-danger";
                }
                $(".uv-index").empty();
                $(".uv-index").append("<strong>UV Index:</strong>&nbsp;&nbsp;<span class=\"tag" + uvClass + "\">" + uvIdx + "</span>");
            })
        } else {
            console.log(res);
        }
    })
}
async function fetchCurrentLatLonData (url) {
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                let currentCityData = data;
                buildCurrentCityContent(currentCityData);
            })
        } else {
            if (res.status == "404") {
                cityNotFound();
            }
        }
    })
}
async function fetchCurrentCityData (url,city) {
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                let currentCityData = data;
                buildCurrentCityContent(currentCityData);
                addCityToStorage(city);
            })
        } else {
            if (res.status == "404") {
                cityNotFound();
            }
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
async function getLocalTime(latitude,longitude) {
    let url = "https://api.geoapify.com/v1/geocode/reverse?lat=" + latitude + "&lon=" + longitude + "&apiKey=" + reverseGeocodingApiKey;
    await fetch(url).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                let timezone = data.features[0].properties.timezone.name,
                    localTime = moment().tz(timezone).format('h:mm a');
                $(".city-time").empty();
                $(".city-time").append("<strong>Local Time:</strong> " + localTime);
            })
        } else {
            console.log(res);
        }
    })
}