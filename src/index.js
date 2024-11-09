const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-button");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-text");
const tempTxt = document.querySelector(".temp-text");
const conditionTxt = document.querySelector(".condition-text");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-icon");
const currentDayTxt = document.querySelector(".current-date-text");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

const apiKey = "15347c17ceac19ac65837d4eecf65b31";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcons(id) {
  if (id <= 232) return "thunderstorms.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  console.log(weatherData);

  if (weatherData.cod !== 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  const tempCelsius = temp - 273.15;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(tempCelsius) + " °C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";

  weatherSummaryImg.src = `../assets/weather/${getWeatherIcons(id)}`;

  currentDayTxt.textContent = getCurrentDate();

  await updateForecastInfo(city);

  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData('forecast', city);

  console.log(forecastData);
  

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";

  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const tempCelsius = temp - 273.15;

  const dateTaken = new Date(date)
  const dateOptions = {
    day: '2-digit',
    month: "short"
  }
  const dateResult = dateTaken.toLocaleDateString("en-US" , dateOptions)

  const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="../assets/weather/${getWeatherIcons(id)}" alt="" />
            <h5 class="forecast-item-temp">${Math.round(tempCelsius)} °C</h5>
        </div>`;

    forecastItemsContainer.insertAdjacentHTML("beforeend" , forecastItem)    
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
