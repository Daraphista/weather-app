import "./style.css";

const content = document.querySelector("#content");
content.innerHTML = `
  <form onsubmit="event.preventDefault();">
  <input type="text" name="search" id="search" placeholder="Search for your city..." autocomplete="off">
  <button><i class="fas fa-search"></i></button>
  <p id="error">Cannot find city</p>
  </form>
  <section>
  <p id="city"></p>
  <h2 id="weather"></h2>
  <div>
  <h1 id="temperature"></h1>
  <div>
  <p id="wind-speed"></p>
  <p id="humidity"></p>
  </div>
  </div>
  </section>
`;

const form = document.querySelector("form");
const input = document.querySelector("form input");
const defaultSearchTerm = "Manila";
function isError(object) {
  console.log("cod" in object, "message" in object);
  return "cod" in object && "message" in object;
}
async function getSearchInput() {
  try {
    if (input.value === "") {
      throw defaultSearchTerm;
    }
    const searchTerm = await input.value;
    console.log(searchTerm);
    return searchTerm;
  } catch (err) {
    return defaultSearchTerm;
  }
}
async function getWeatherData() {
  const searchTerm = await getSearchInput(input);
  let response;
  try {
    response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&APPID=9d4389abef009b40baac3aadd192b830`,
      { mode: "cors" }
    );
  } catch (err) {
    console.log(err);
  }
  const weatherData = await response.json();
  return weatherData;
}
async function displayWeatherData() {
  try {
    const weatherData = await getWeatherData();

    if (!isError(weatherData)) {
      const city = document.querySelector("#city");
      const weather = document.querySelector("#weather");
      const temperature = document.querySelector("#temperature");
      const humidity = document.querySelector("#humidity");
      const windSpeed = document.querySelector("#wind-speed");

      city.textContent = weatherData.name;
      weather.textContent = weatherData.weather[0].description;
      temperature.textContent = `${weatherData.main.temp.toFixed()}°C`;
      windSpeed.textContent = `Wind: ${weatherData.wind.speed.toFixed(1)}m/s`;
      humidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
      document.querySelector("#error").classList.add("revealed");
    } else {
      document.querySelector("#error").classList.remove("revealed");
    }
  } catch (err) {
    console.log("oops");
  }
}

displayWeatherData();
form.addEventListener("submit", () => {
  displayWeatherData();
  input.value = "";
});
