//Global varibles to get HTML elements
var cityEl = document.getElementById("enterCity");
var cityNameEl = document.getElementById("cityName");
var searchButtonEl = document.getElementById("searchButton");
var currentIconEl = document.getElementById("currentWeatherIcon");
var todayEl = document.getElementById("weatherToday");
var tempEl = document.getElementById("temperature");
var humidEl = document.getElementById("humidity");
var windEl = document.getElementById("wind");
var forecastEl = document.getElementById("5dayHeading");
let history = JSON.parse(localStorage.getItem("search")) || [];
var historyEl = document.getElementById("history");
var clearHistory = document.getElementById("clearHistory");

var APIkey = "c1dd9d02e955f85934394531eb29b9cd";
//Weather data collection function
function collectToday(cityName) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    APIkey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //Parsing data from API fetch to elements
      todayEl.classList.remove("d-none");

      var todayDate = new Date(data.dt * 1000);
      var day = todayDate.getDate();
      var month = todayDate.getMonth() + 1;
      var year = todayDate.getFullYear();
      cityNameEl.innerHTML =
        data.name + " (" + day + "/" + month + "/" + year + ") ";
      var weatherIcon = data.weather[0].icon;
      currentIconEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
      );
      currentIconEl.setAttribute("alt", data.weather[0].description);
      tempEl.innerHTML = "Tempurature: " + kelvinConvert(data.main.temp) + "°C";
      humidEl.innerHTML = "Humidity: " + data.main.humidity + "%";
      windEl.innerHTML = "Wind Speed: " + data.wind.speed + "mph";
      //5 day forcast for current city input
      var currentCity = data.id;
      var fiveQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        currentCity +
        "&appid=" +
        APIkey;
      fetch(fiveQueryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //Parse the forcast data fetch to the 5 day row element
          forecastEl.classList.remove("d-none");
          var allForecastEl = document.querySelectorAll(".forecast");
          for (i = 0; i < allForecastEl.length; i++) {
            allForecastEl[i].innerHTML = "";
            var fiveIndex = i * 8 + 4;
            var fiveDate = new Date(data.list[fiveIndex].dt * 1000);
            var fiveDay = fiveDate.getDate();
            var fiveMonth = fiveDate.getMonth() + 1;
            var fiveYear = fiveDate.getFullYear();
            var fiveDateEl = document.createElement("p");
            fiveDateEl.setAttribute("class", "mt-3 mb-0 forecastDate");
            fiveDateEl.innerHTML = fiveDay + "/" + fiveMonth + "/" + fiveYear;
            allForecastEl[i].append(fiveDateEl);
            var fiveIcon = document.createElement("img");
            fiveIcon.setAttribute(
              "src",
              "https://openweathermap.org/img/wn/" +
                data.list[fiveIndex].weather[0].icon +
                "@2x.png"
            );
            fiveIcon.setAttribute(
              "alt",
              data.list[fiveIndex].weather[0].description
            );
            allForecastEl[i].append(fiveIcon);
            var fiveTempEl = document.createElement("p");
            fiveTempEl.innerHTML =
              "Temp: " + kelvinConvert(data.list[fiveIndex].main.temp) + "°C";
            allForecastEl[i].append(fiveTempEl);
            var fiveHumidEl = document.createElement("p");
            fiveHumidEl.innerHTML =
              "Humidity: " + data.list[fiveIndex].main.humidity + "%";
            allForecastEl[i].append(fiveHumidEl);
          }
        });
    });
}
//Search eventlistener with local storage search history
searchButtonEl.addEventListener("click", function () {
  var citySearch = cityEl.value;
  collectToday(citySearch);
  history.push(citySearch);
  localStorage.setItem("search", JSON.stringify(history));
  historyRender();
});
//function to generate the search history elements
function historyRender() {
  historyEl.innerHTML = "";
  for (let i = 0; i < history.length; i++) {
    const historyDetail = document.createElement("input");
    historyDetail.setAttribute("type", "text");
    historyDetail.setAttribute("readonly", true);
    historyDetail.setAttribute("class", "form-control d-block bg-white");
    historyDetail.setAttribute("value", history[i]);
    historyDetail.addEventListener("click", function () {
      collectToday(historyDetail.value);
    });
    historyEl.append(historyDetail);
  }
}
//clear history button functionality
clearHistory.addEventListener("click", function () {
  localStorage.clear();
  history = [];
  historyRender();
});

historyRender();
if (history.length > 0) {
  collectToday(history[history.length - 1]);
}

//Kelvin to celcius conversion function
function kelvinConvert(K) {
  return Math.floor(K - 273.15);
}
