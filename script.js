
// UI Elements
const weatherInfo = document.querySelector(".weather-info");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temperature");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const errorEl = document.getElementById("error");
const weatherIconEl = document.getElementById("weather-icon");
const loadingSpinner = document.getElementById("loading-spinner");
const locationBtn = document.getElementById("location-btn");
const weatherEffectsContainer = document.getElementById("weather-effects");

let spinnerStartedAt = 0;

// Spinner functions
function showSpinner() {
  document.body.classList.add('loading');
  loadingSpinner.style.display = "flex";
  spinnerStartedAt = Date.now();
}

function hideSpinner() {
  document.body.classList.remove('loading');
  const elapsed = Date.now() - spinnerStartedAt;
  const minTime = 600;
  const finish = () => {
    loadingSpinner.classList.add("hidden");
    setTimeout(() => {
      loadingSpinner.style.display = "none";
      loadingSpinner.classList.remove("hidden");
    }, 300);
  };
  if (elapsed < minTime) setTimeout(finish, minTime - elapsed);
  else finish();
}

// Weather effects management
function clearWeatherEffects() {
  weatherEffectsContainer.innerHTML = "";
}

function createRainEffect() {
  clearWeatherEffects();
  for (let i = 0; i < 80; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${Math.random() * 1 + 1}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    weatherEffectsContainer.appendChild(drop);
  }
}

function createSnowEffect() {
  clearWeatherEffects();
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.textContent = "❄";
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.fontSize = `${Math.random() * 10 + 10}px`;
    flake.style.animationDuration = `${Math.random() * 5 + 5}s`;
    flake.style.animationDelay = `${Math.random() * 5}s`;
    weatherEffectsContainer.appendChild(flake);
  }
}

function createSunRays() {
  clearWeatherEffects();
  const raysCount = 8;
  for (let i = 0; i < raysCount; i++) {
    const ray = document.createElement("div");
    ray.classList.add("sun-ray");
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    ray.style.top = `${top}%`;
    ray.style.left = `${left}%`;
    const size = 400 + Math.random() * 400;
    ray.style.width = `${size}px`;
    ray.style.height = `${size}px`;
    ray.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    ray.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
    ray.style.animationDuration = `${20 + Math.random() * 40}s`;
    weatherEffectsContainer.appendChild(ray);
  }
}
function createCloudEffect() {
  clearWeatherEffects();

  const frontClouds = 6;

  for (let i = 0; i < frontClouds; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud-effect");

    const top = Math.random() * 60;
    const size = 100 + Math.random() * 100;

    // start offscreen left
    cloud.style.left = `-${200 + Math.random() * 200}px`;
    cloud.style.top = `${top}vh`;
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size / 2}px`;

    // faster animation
    cloud.style.animationDuration = `${25 + Math.random() * 15}s`;

    // negative delay so some start mid-animation
    cloud.style.animationDelay = `${-Math.random() * 25}s`;

    weatherEffectsContainer.appendChild(cloud);
  }
}


// Fetch weather by city
async function getWeather(city) {
  try {
    errorEl.textContent = "";
    showSpinner();
    weatherInfo.classList.remove("visible");

    const response = await fetch(
        `https://weatherappdary.netlify.app/.netlify/functions/weather?q=${encodeURIComponent(city)}`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    updateUI(data);
  } catch (err) {
    console.error(err);
    errorEl.textContent = "City not found or server error";
    weatherIconEl.classList.remove("show");
    clearWeatherEffects();
  } finally {
    hideSpinner();
  }
}

// Update the UI with the weather data
function updateUI(data) {
  cityNameEl.textContent = data.name;
  const tempValue = Math.round(data.main.temp);
  tempEl.textContent = `${tempValue} °C`;

  // Temperature colors
  if (tempValue <= 0) {
    tempEl.style.color = "#4dabf7";
    tempEl.style.textShadow = "0 0 10px #a5d8ff";
  } else if (tempValue <= 15) {
    tempEl.style.color = "#74c0fc";
    tempEl.style.textShadow = "0 0 10px #bde0fe";
  } else if (tempValue <= 25) {
    tempEl.style.color = "#ff3f96";
    tempEl.style.textShadow = "0 0 10px #ffb6d9";
  } else if (tempValue <= 35) {
    tempEl.style.color = "#ff8a3f";
    tempEl.style.textShadow = "0 0 10px #ffd8b1";
  } else {
    tempEl.style.color = "#ff2f2f";
    tempEl.style.textShadow = "0 0 10px #ffaaaa";
  }

  // Temperature animation
  tempEl.classList.remove("pop");
  void tempEl.offsetWidth;
  tempEl.classList.add("pop");

  feelsLikeEl.textContent = `Feels like: ${Math.round(data.main.feels_like)} °C`;
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windEl.textContent = `Wind: ${Math.round(data.wind.speed)} m/s`;

  // Weather icon selection
  const weatherMain = data.weather[0].main.toLowerCase();
  let iconPath = "assets/sun.png";
  if (weatherMain.includes("cloud")) iconPath = "assets/cloud.png";
  else if (weatherMain.includes("rain")) iconPath = "assets/rain.png";
  else if (weatherMain.includes("snow")) iconPath = "assets/snow.png";
  else if (weatherMain.includes("thunderstorm")) iconPath = "assets/storm.png";
  else if (weatherMain.includes("mist") || weatherMain.includes("fog")) iconPath = "assets/mist.png";

  weatherIconEl.classList.remove("show");
  setTimeout(() => {
    weatherIconEl.src = iconPath;
    weatherIconEl.classList.add("show");
  }, 300);

  // Apply background and effects
  document.body.className = "";
  clearWeatherEffects();

  if (weatherMain.includes("cloud")) {
    document.body.classList.add("cloudy")
    createCloudEffect();;
  } else if (weatherMain.includes("rain")) {
    document.body.classList.add("rainy");
    createRainEffect();
  } else if (weatherMain.includes("snow")) {
    document.body.classList.add("snowy");
    createSnowEffect();
  } else if (weatherMain.includes("thunderstorm")) {
    document.body.classList.add("stormy");
  } else if (weatherMain.includes("mist") || weatherMain.includes("fog")) {
    document.body.classList.add("misty");
  } else if (weatherMain.includes("clear")) {
    document.body.classList.add("sunny");
    createSunRays();
  }

  weatherInfo.classList.add("visible");
}

// Search event
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) getWeather(city);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) getWeather(city);
  }
});

// Geolocation on load
window.addEventListener("load", () => {
  if (!navigator.geolocation) {
    errorEl.textContent = "Geolocation not supported by your browser";
    return;
  }
  showSpinner();
  weatherInfo.classList.remove("visible");

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const response = await fetch(
            `https://weatherappdary.netlify.app/.netlify/functions/weather?lat=${coords.latitude}&lon=${coords.longitude}`
        );
        if (!response.ok) throw new Error("Location weather failed");
        const data = await response.json();
        updateUI(data);
      } catch (err) {
        console.error("Geolocation weather error:", err);
        errorEl.textContent = "Could not get weather for your location";
      } finally {
        hideSpinner();
      }
    },
    (err) => {
      console.warn("User denied geolocation:", err);
      errorEl.textContent = "Location access denied";
      hideSpinner();
    }
  );
});

// Geolocation on button click
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    errorEl.textContent = "Geolocation not supported by your browser";
    return;
  }
  showSpinner();
  weatherInfo.classList.remove("visible");

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        const response = await fetch(
            `https://weatherappdary.netlify.app/.netlify/functions/weather?lat=${coords.latitude}&lon=${coords.longitude}`
        );
        if (!response.ok) throw new Error("Location weather failed");
        const data = await response.json();
        updateUI(data);
      } catch (err) {
        console.error("Geolocation weather error:", err);
        errorEl.textContent = "Could not get weather for your location";
      } finally {
        hideSpinner();
      }
    },
    (err) => {
      console.warn("User denied geolocation:", err);
      errorEl.textContent = "Location access denied";
      hideSpinner();
    }
  );
});

// Add butterfly decoration on top of container
function addButterfly() {
  const butterfly = document.createElement("img");
  butterfly.src = "assets/butterfly.png";
  butterfly.classList.add("butterfly-image");
  document.querySelector(".container").appendChild(butterfly);
}

addButterfly();
