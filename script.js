// const apiKey = 'f3bbd755daf44a6a899120948241909';
// const apiEndpoint = `http://api.weatherapi.com/v1/current.json?`;

const weatherApp = document.querySelector(".weather-wrapper");
const tempElement = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const weatherIcon = document.querySelector(".w-icon");
const conditionOutput = document.querySelector(".condition");
const cityName = document.querySelector(".city-name");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const feelOutput = document.querySelector(".feel");
const winddirOutput = document.querySelector(".winddir");
const heatindexOutput = document.querySelector(".heatindex");
const gustOutput = document.querySelector(".gust");
const winddegreeOutput = document.querySelector(".wind_degree");
const pressureOutput = document.querySelector(".pressure");
const windOutput = document.querySelector(".wind");
const locationInput = document.querySelector("#location");
const search = document.querySelector(".search");
const btn = document.querySelector(".btn");
const errorMsg = document.querySelector(".errormsg");
let cityInput = "new york";

search.addEventListener("input", () => {
  cityInput = search.value;
});

btn.addEventListener("click", (e) => {
  if (search.value.length === 0) {
    alert("Please enter a city name");
  } else {
    fetchWeatherData();
    search.value = "";
    weatherApp.style.opacity = 0;
  }
  e.preventDefault();
});

function daysinaweek(day, month, year) {
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return week[new Date(`${year}/${month}/${day}`).getDay()];
}

function fetchWeatherData() {
  fetch(
    `http://api.weatherapi.com/v1/current.json?key=f3bbd755daf44a6a899120948241909&q=${cityInput}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      tempElement.innerHTML = data.current.temp_c + "&#176;";
      conditionOutput.innerHTML = data.current.condition.text;

      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);

      dateOutput.innerHTML = `${daysinaweek(d, m, y)} ${d}/${m}/${y}`;
      timeOutput.innerHTML = time;
      cityName.innerHTML = data.location.name;

      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64".length
      );
      weatherIcon.src = `https://cdn.weatherapi.com/weather/64x64/${iconId}`;

      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";
      winddirOutput.innerHTML= data.current.wind_dir
      winddegreeOutput.innerHTML= data.current.wind_degree + "&#176;"
      pressureOutput.innerHTML = data.current.pressure_mb
      feelOutput.innerHTML = data.current.feelslike_c + "&#176;"
      gustOutput.innerHTML = data.current.gust_kph + "km/h"
      heatindexOutput.innerHTML = data.current.heatindex_c + "&#176;"

      let daytime = "day";
      const code = data.current.condition.code;
      if (!data.current.is_day) {
        daytime = "night";
      }
      if (code == 1000) {
        weatherApp.style.backgroundImage = `url(images/${daytime}/clear.jpg)`;
      } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1030 ||
        code == 1009 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1282
      ) {
        weatherApp.style.backgroundImage = `url(images/${daytime}/cloudy.jpg)`;
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1183 ||
        code == 1180 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1249 ||
        code == 1246 ||
        code == 1252
      ) {
        weatherApp.style.backgroundImage = `url(images/${daytime}/rain.jpg)`;
      } else {
        weatherApp.style.backgroundImage = `url(images/${daytime}/snow.jpg)`;
      }

      weatherApp.style.opacity = "1";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);

      errorMsg.innerHTML = `<p>City Not Found or Weather Data is Currently Unavailable.</p>`;
      setTimeout(() => {
        window.location.reload(); // Reloads the page
      }, 2000); // Wait for 2 seconds before redirecting
      return false; // Return false when an error occurs
 
    });

  weatherApp.style.opacity = "1";
  weatherForecast();
}

function forecastWeek(day, month, year) {
  const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return week[new Date(`${year}/${month}/${day}`).getDay()];
}

function weatherForecast() {
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=f3bbd755daf44a6a899120948241909&q=${cityInput}&days=7`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const forecastContainer = document.getElementById("weather-forecast");
      forecastContainer.innerHTML = "<h4>7 Days weather forecast</h4>";

      const forecastDays = data.forecast.forecastday; // 7-day forecast data
      forecastDays.forEach((day, index) => {
        const date = day.date;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));

        // Create a new element for each day
        const forecastElement = document.createElement("div");
        forecastElement.className = "info"; // add a class to style the element
        forecastElement.innerHTML = `
          <img src="https://cdn.weatherapi.com/weather/64x64/${day.day.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64".length
          )}" alt="Weather Icon">
                <span>${day.day.maxtemp_c}&#176;</span>
          <span>${day.day.condition.text}</span>
           <!-- <span>sunrise:${day.astro.sunrise}</span>
          <span>sunset: ${day.astro.sunset}</span>-->
          <span>${forecastWeek(d, m, y)} ${d}/${m}/${y}</span>
        
    
        `;

        // Append the forecast to the forecast container
        forecastContainer.appendChild(forecastElement);
      });
    })
    .catch((error) => console.error("Error fetching weather data:", error));
}
fetchWeatherData();
weatherApp.style.opacity = "1";
