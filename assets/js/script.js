let cityName = "Detroit",
    fiveDayForecastArr = [],
    apiKey = "e69b9e2eef69c1c5006d043926d24dd0",
    citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey,
    fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;
    currentCityData = {
        "coord": {
          "lon": -83.0458,
          "lat": 42.3314
        },
        "weather": [
          {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04d"
          }
        ],
        "base": "stations",
        "main": {
          "temp": 28.96,
          "feels_like": 18.66,
          "temp_min": 25.18,
          "temp_max": 32.38,
          "pressure": 1037,
          "humidity": 62
        },
        "visibility": 10000,
        "wind": {
          "speed": 12.66,
          "deg": 50
        },
        "clouds": {
          "all": 75
        },
        "dt": 1677274761,
        "sys": {
          "type": 2,
          "id": 2006979,
          "country": "US",
          "sunrise": 1677240962,
          "sunset": 1677280510
        },
        "timezone": -18000,
        "id": 4990729,
        "name": "Detroit",
        "cod": 200
};
let fiveDayForecastData = {
    "cod": "200",
    "message": 0,
    "cnt": 5,
    "list": [
      {
        "dt": 1677294000,
        "main": {
          "temp": 23.97,
          "feels_like": 15.26,
          "temp_min": 23.56,
          "temp_max": 23.97,
          "pressure": 1038,
          "sea_level": 1038,
          "grnd_level": 1013,
          "humidity": 68,
          "temp_kf": 0.23
        },
        "weather": [
          {
            "id": 801,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02n"
          }
        ],
        "clouds": {
          "all": 21
        },
        "wind": {
          "speed": 7.74,
          "deg": 92,
          "gust": 7.54
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
          "pod": "n"
        },
        "dt_txt": "2023-02-25 03:00:00"
      },
      {
        "dt": 1677304800,
        "main": {
          "temp": 24.21,
          "feels_like": 15.94,
          "temp_min": 24.21,
          "temp_max": 24.22,
          "pressure": 1035,
          "sea_level": 1035,
          "grnd_level": 1010,
          "humidity": 60,
          "temp_kf": -0.01
        },
        "weather": [
          {
            "id": 803,
            "main": "Clouds",
            "description": "broken clouds",
            "icon": "04n"
          }
        ],
        "clouds": {
          "all": 55
        },
        "wind": {
          "speed": 7.2,
          "deg": 123,
          "gust": 8.72
        },
        "visibility": 10000,
        "pop": 0,
        "sys": {
          "pod": "n"
        },
        "dt_txt": "2023-02-25 06:00:00"
      },
      {
        "dt": 1677315600,
        "main": {
          "temp": 24.24,
          "feels_like": 15.06,
          "temp_min": 24.24,
          "temp_max": 24.24,
          "pressure": 1030,
          "sea_level": 1030,
          "grnd_level": 1007,
          "humidity": 74,
          "temp_kf": 0
        },
        "weather": [
          {
            "id": 600,
            "main": "Snow",
            "description": "light snow",
            "icon": "13n"
          }
        ],
        "clouds": {
          "all": 100
        },
        "wind": {
          "speed": 8.5,
          "deg": 128,
          "gust": 11.97
        },
        "visibility": 4908,
        "pop": 0.43,
        "snow": {
          "3h": 0.15
        },
        "sys": {
          "pod": "n"
        },
        "dt_txt": "2023-02-25 09:00:00"
      },
      {
        "dt": 1677326400,
        "main": {
          "temp": 25.09,
          "feels_like": 17.17,
          "temp_min": 25.09,
          "temp_max": 25.09,
          "pressure": 1028,
          "sea_level": 1028,
          "grnd_level": 1005,
          "humidity": 89,
          "temp_kf": 0
        },
        "weather": [
          {
            "id": 600,
            "main": "Snow",
            "description": "light snow",
            "icon": "13n"
          }
        ],
        "clouds": {
          "all": 100
        },
        "wind": {
          "speed": 7,
          "deg": 135,
          "gust": 13.13
        },
        "visibility": 570,
        "pop": 1,
        "snow": {
          "3h": 1.44
        },
        "sys": {
          "pod": "n"
        },
        "dt_txt": "2023-02-25 12:00:00"
      },
      {
        "dt": 1677337200,
        "main": {
          "temp": 29.17,
          "feels_like": 22.87,
          "temp_min": 29.17,
          "temp_max": 29.17,
          "pressure": 1026,
          "sea_level": 1026,
          "grnd_level": 1003,
          "humidity": 74,
          "temp_kf": 0
        },
        "weather": [
          {
            "id": 600,
            "main": "Snow",
            "description": "light snow",
            "icon": "13d"
          }
        ],
        "clouds": {
          "all": 100
        },
        "wind": {
          "speed": 5.99,
          "deg": 189,
          "gust": 9.28
        },
        "visibility": 10000,
        "pop": 0.22,
        "snow": {
          "3h": 0.11
        },
        "sys": {
          "pod": "d"
        },
        "dt_txt": "2023-02-25 15:00:00"
      }
    ],
    "city": {
      "id": 4990729,
      "name": "Detroit",
      "coord": {
        "lat": 42.3314,
        "lon": -83.0458
      },
      "country": "US",
      "population": 713777,
      "timezone": -18000,
      "sunrise": 1677240962,
      "sunset": 1677280510
    }
  };

$(window).on("resize", function() {
    let winWidth = $(this).width();
    if (winWidth < 700) {
        document.getElementById("side-bar").style.marginLeft = "-16em";
    } else if (winWidth > 700) {
        document.getElementById("side-bar").style.marginLeft = "0";
    }
});
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
/*
                <div class="tile is-parent" id="day-one">
                  <article class="tile is-child notification is-danger">
                    <p class="tile-txt">Date</p>
                    <p class="tile-txt">Temp</p>
                    <p class="tile-txt">Humidity</p>
                  </article>
                </div>
*/
function searchCity() {
    let inputVal = $("#search-input").val().replace(/ /g, '+');;
    console.log(inputVal);
    $('#search-input').val('');
}
function loadCurrentCityData() {
    var sunriseTimestamp = currentCityData.sys.sunrise,
        sunsetTimestamp = currentCityData.sys.sunset,
        cityTimezone = currentCityData.timezone,
        currentSunrise = moment.utc(sunriseTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
        currentSunset = moment.utc(sunsetTimestamp,'X').add(cityTimezone,'seconds').format('h:mm a'),
        fiveDayForecastList = fiveDayForecastData.list;
    
    for (let i = 0; i < fiveDayForecastList.length; i++) {
        let weatherTimestamp = fiveDayForecastList[i].dt,
            //daysDate = moment.unix(weatherTimestamp).format('dddd, MMM'),
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
    $(".city-name").append("<strong>" + currentCityData.name + "<strong>");
    $(".city-temp").append("<strong>Current Temperature:</strong> " + currentCityData.main.temp.toFixed() + "°");
    $(".city-feelslike").append("<strong>Feels Like:</strong> " + currentCityData.main.feels_like.toFixed() + "°");
    $(".city-humidity").append("<strong>Current Humidity:</strong> " + currentCityData.main.humidity + "%");
    $(".city-wind").append("<strong>Current Wind Speed:</strong> " + currentCityData.wind.speed.toFixed() + " MPH");
    $(".city-sunrise").append("<strong>Sunrise:</strong> " + currentSunrise + "&nbsp;&nbsp;<i class=\"fa fa-regular fa-sun\"></i>");
    $(".city-sunset").append("<strong>Sunset:</strong> " + currentSunset + "&nbsp;&nbsp;<i class=\"fa-regular fa-moon\"></i>");
    $(".weather-condition").attr("src", "https://openweathermap.org/img/wn/" + currentCityData.weather[0].icon + "@2x.png");

}
loadCurrentCityData();