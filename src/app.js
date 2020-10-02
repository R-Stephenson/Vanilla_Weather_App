function formatDay(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day}`;
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dayNumber = date.getDate();
  let months = [
    "February",
    "March",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
  ];
  let month = months[date.getMonth()];
  return `${formatDay(timestamp)} ${dayNumber} | ${month} | ${formatTime(
    timestamp
  )}`;
}

function formatTime(timestamp) {
  let time = new Date(timestamp);
  let ampm = time.getHours() >= 12 ? "pm" : "am";
  let hours = time.getHours() >= 12 ? time.getHours() - 12 : time.getHours();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes} ${ampm}`;
}

function displayTemperature(response) {
  celciusTemperature = response.data.main.temp;

  let dateElement = document.querySelector("#date");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let feelsLikeElement = document.querySelector("#feels-like");
  let sunriseElement = document.querySelector("#sunrise");
  let sunsetElement = document.querySelector("#sunset");
  let temperatureElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let mainIcon = document.querySelector("#icon");

  let getIconCode = response.data.weather[0].icon;

  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  sunriseElement.innerHTML = formatTime(response.data.sys.sunrise * 1000);
  sunsetElement.innerHTML = formatTime(response.data.sys.sunset * 1000);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  descriptionElement.innerHTML = response.data.weather[0].description;

  mainIcon.setAttribute("alt", descriptionElement);
  mainIcon.setAttribute("src", `media/${getIconCode}.png`);

  displayForecast(response);

  let bgImage = document.querySelector("#weatherImg");
  bgImage.style.backgroundImage = `linear-gradient(
      45deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ), url(media/images/${getIconCode}.png)`;
}

function displayHourlyForecast(response) {
  let forecastElement = document.querySelector("#hourly-forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.hourly[index];
    forecastElement.innerHTML += `
    <div class="col-4 hf">
        <h3><strong>
    ${formatTime(forecast.dt * 1000)}
    </strong><h3>
    <img id="h-icon"
    src="media/${forecast.weather[0].icon}.png" width="60"/>
    <div class="forecast-temperature hourly">${Math.round(
      forecast.temp
    )}° | <strong><span class="f-like">fl </span>${Math.round(
      forecast.feels_like
    )}° </strong></div></div>`;
    let icon = document.querySelector("#h-icon");
    let getIconCode = forecast.weather[0].icon;
    icon.setAttribute("src", `media/${getIconCode}.png`);
  }
}

function displayDailyForecast(response) {
  let forecastElement = document.querySelector("#daily-forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 1; index < 5; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
     <div class="col-6 .df">
     <h3 id="tomorrow"><strong>
     ${formatDay(forecast.dt * 1000)}
     </strong><h3>
     <img id="d-icon"
    src="media/${forecast.weather[0].icon}.png" width="60"/>
    <div class="forecast-temperature daily" ><i class="fas fa-long-arrow-alt-up"></i> ${Math.round(
      forecast.temp.max
    )}° | <i class="fas fa-long-arrow-alt-down"></i> ${Math.round(
      forecast.temp.min
    )}°</div></div>`;

    let icon = document.querySelector("#d-icon");
    let getIconCode = forecast.weather[0].icon;
    icon.setAttribute("src", `media/${getIconCode}.png`);

    if (index === 1) {
      let tomorrowElement = document.querySelector("#tomorrow");
      tomorrowElement.innerHTML = `<strong>Tomorrow</strong>`;
    }
  }
}

function displayForecast(response) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayHourlyForecast);
  axios.get(apiUrl).then(displayDailyForecast);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function searchCurrentLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  searchCity(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let apiKey = "3e1b3b8411774a6a5d3ce0ee0f1a08dc";

let celciusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

searchCity("cardiff");
getCurrentLocation();
