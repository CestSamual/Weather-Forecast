//Global varibles to get HTML elements
var cityEl = document.getElementById("enterCity");
var cityNameEl = document.getElementById("cityName");
var searchButtonEl = document.getElementById("searchButton");
var currentIconEl = document.getElementById("currentWeatherIcon");
var todayEl = document.getElementById("weatherToday");
var tempEl = document.getElementById("temperature");
var humidEl = document.getElementById("humidity");
var windEl = document.getElementById("wind");

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
    });
}
//Search eventlistener
searchButtonEl.addEventListener("click", function () {
  var citySearch = cityEl.value;
  collectToday(citySearch);
});
//Kelvin to celcius conversion function
function kelvinConvert(K) {
  return Math.floor(K - 273.15);
}
