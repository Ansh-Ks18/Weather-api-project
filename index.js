// ============================
// SELECT ELEMENTS
// ============================

const search = document.getElementById("search-icon");
const cityname = document.getElementById("city");

const temperature = document.getElementById("temperature");
const humidityText = document.getElementById("humidity");
const windText = document.getElementById("wind");
const weatherIcon = document.querySelector(".weather-icon");
const weatherConditionText = document.getElementById("weather");
const displayCityName = document.getElementById("displayCityName"); // New

const body = document.querySelector("body");

const feel = document.getElementById("feelsLike");
const maxtemp = document.getElementById("tempMax");
const mintemp = document.getElementById("tempMin");

// New premium elements
const pressureText = document.getElementById("pressure");
const visibilityText = document.getElementById("visibility");
const dateTimeText = document.getElementById("dateTime");

const weatherBody = document.querySelector(".weather-body");
const loadingText = document.getElementById("loading");

const API_KEY = "a39077f06fa66676431f78da706f739f"; // Your key

// ============================
// LIVE DATE & TIME FUNCTION
// ============================
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dateTimeText.innerHTML = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime(); // Call immediately

// ============================
// CLICK & ENTER EVENTS
// ============================

search.addEventListener("click", function () {
    let city = cityname.value.trim();
    if (city === "") {
        alert("Please enter a valid city name");
        weatherBody.style.display = "none";
        return;
    }
    cityname.blur();
    getWeather(city);
});

cityname.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        let city = cityname.value.trim();
        if(city === ""){
            alert("Please enter city name");
            weatherBody.style.display = "none";
            return;
        }
        cityname.blur();
        getWeather(city);
    }
});

// ============================
// SHARED UI UPDATE LOGIC
// ============================
// Created this so both your original getWeather and the new geolocation function can use the same logic without repeating code.
function updateWeatherUI(data) {
    weatherBody.style.display = "block";
    
    // City Name
    displayCityName.innerHTML = `${data.name}, ${data.sys.country}`;

    // Temperature
    let temp = Math.round(data.main.temp); // Rounded for cleaner look
    temperature.innerHTML = `${temp}°C`;

    // Humidity & Wind
    humidityText.innerHTML = `${data.main.humidity}%`;
    windText.innerHTML = `${data.wind.speed} Km/h`;

    // Extra Temps
    feel.innerHTML = `${Math.round(data.main.feels_like)}°C`;
    mintemp.innerHTML = `${Math.round(data.main.temp_min)}°C`;
    maxtemp.innerHTML = `${Math.round(data.main.temp_max)}°C`;

    // Premium Extra Data
    pressureText.innerHTML = `${data.main.pressure} hPa`;
    visibilityText.innerHTML = `${(data.visibility / 1000).toFixed(1)} km`;

    // Weather Icon + Background
    let condition = data.weather[0].main;
    weatherConditionText.innerHTML = data.weather[0].description; // Show description

    if (condition === "Clouds") {
        weatherIcon.src = "images/clouds.png";
        body.style.backgroundImage = "url('images/cloudy.png')";
    }
    else if (condition === "Rain" || condition === "Drizzle") {
        weatherIcon.src = "images/rain.png";
        body.style.backgroundImage = "url('images/rainn.png')";
    }
    else if (condition === "Mist" || condition === "Haze" || condition === "Fog") {
        weatherIcon.src = "images/mist.png";
        body.style.backgroundImage = "url('images/mistt.png')";
    }
    else if (condition === "Clear") {
        weatherIcon.src = "images/clear.png";
        body.style.backgroundImage = "url('images/sunny.png')";
    }
    else if (condition === "Snow") {
        weatherIcon.src = "images/snow.png";
        body.style.backgroundImage = "url('images/snoww.png')";
    }
    else {
        weatherIcon.src = "images/clouds.png";
        body.style.backgroundImage = "url('images/default.png')";
    }
}

// ============================
// ORIGINAL WEATHER FUNCTION
// ============================
async function getWeather(city) {
    weatherBody.style.display = "none";
    loadingText.style.display = "block";

    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        let response = await fetch(url);
        let data = await response.json();

        loadingText.style.display = "none";

        if (data.cod !== 200) {
            alert("City not found");
            return;
        }

        updateWeatherUI(data);

    } catch (error) {
        loadingText.style.display = "none";
        alert("City not found or network error");
        console.log(error);
    }
}

// ============================
// LOCATION FEATURES
// ============================

// ONLY ask for location when the GPS icon is clicked
document.getElementById("gps-icon").addEventListener("click", getCurrentLocation);

function getCurrentLocation(){
    if(navigator.geolocation){
        loadingText.style.display = "block";
        weatherBody.style.display = "none";
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    }else{
        alert("Geolocation not supported");
    }
}

function successLocation(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    getWeatherByLocation(lat, lon);
}

function errorLocation(){
    loadingText.style.display = "none";
    alert("Location permission denied");
}
// ============================
// THE MISSING FUNCTION
// ============================
async function getWeatherByLocation(lat, lon) {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        
        let response = await fetch(url);
        let data = await response.json();

        loadingText.style.display = "none";

        if (data.cod !== 200) {
            alert("Location data not found");
            return;
        }

        updateWeatherUI(data);

    } catch (error) {
        loadingText.style.display = "none";
        alert("Network error while fetching location weather");
        console.log(error);
    }
}

// ============================
    // WEATHER ICON + BACKGROUND
    // ============================
    let condition = data.weather[0].main;
    let currentTemp = data.main.temp; // Grab the exact temperature

    weatherConditionText.innerHTML = data.weather[0].description; // Show description

    // 1. SNOW OR FREEZING TEMPS (Below 0°C)
    if (condition === "Snow" || currentTemp <= 0) {
        weatherIcon.src = "images/snow.png";
        body.style.backgroundImage = "url('images/snoww.png')";
    }
    // 2. RAIN OR STORMS
    else if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
        weatherIcon.src = "images/rain.png";
        body.style.backgroundImage = "url('images/rainn.png')";
    }
    // 3. FOG, MIST, HAZE, SMOKE
    else if (condition === "Mist" || condition === "Haze" || condition === "Fog" || condition === "Smoke") {
        weatherIcon.src = "images/mist.png";
        body.style.backgroundImage = "url('images/mistt.png')";
    }
    // 4. CLEAR SKIES (Above Freezing)
    else if (condition === "Clear") {
        weatherIcon.src = "images/clear.png";
        body.style.backgroundImage = "url('images/sunny.png')";
    }
    // 5. CLOUDY SKIES (Above Freezing)
    else if (condition === "Clouds") {
        weatherIcon.src = "images/clouds.png";
        body.style.backgroundImage = "url('images/cloudy.png')";
    }
    // 6. DEFAULT FALLBACK
    else {
        weatherIcon.src = "images/clouds.png";
        body.style.backgroundImage = "url('images/default.png')";
    }