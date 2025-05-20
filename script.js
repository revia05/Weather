// API Configuration
const API_KEY = '5de70c56c7ca418f958191739251805';
let currentLocation = 'London';
let currentUnit = 'metric';

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const feelsLike = document.getElementById('feels-like');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const precipitationElement = document.getElementById('precipitation');
const visibilityElement = document.getElementById('visibility');
const hourlyForecast = document.getElementById('hourly-forecast');
const dailyForecast = document.getElementById('daily-forecast');

// Theme Elements
//const forestBtn = document.getElementById('forest-btn');
const thunderBtn = document.getElementById('thunder-btn');
const rainBtn = document.getElementById('rain-btn');
const body = document.body;
const currentWeather = document.getElementById('current-weather');
const leavesContainer = document.getElementById('leaves-container');
const thunderContainer = document.getElementById('thunder-container');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    fetchWeather(currentLocation);
    createLeaves();
    
    // Add animations to all weather icons
    document.querySelectorAll('.fa-sun, .fa-cloud, .fa-cloud-sun, .fa-cloud-rain, .fa-moon, .fa-bolt, .fa-snowflake').forEach(icon => {
        icon.classList.add('floating');
    });
});

// Search functionality
searchBtn.addEventListener('click', () => {
    if (locationInput.value.trim() !== '') {
        currentLocation = locationInput.value.trim();
        fetchWeather(currentLocation);
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && locationInput.value.trim() !== '') {
        currentLocation = locationInput.value.trim();
        fetchWeather(currentLocation);
    }
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Fetch weather data from WeatherAPI.com
async function fetchWeather(location) {
    try {
        // Show loading states
        weatherIcon.innerHTML = '<i class="fas fa-spinner rotate"></i>';
        locationElement.textContent = 'Loading...';
        tempElement.textContent = '-';
        
        // Fetch current weather and forecast
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        // Update current weather
        updateCurrentWeather(data);
        
        // Update forecasts
        updateHourlyForecast(data);
        updateDailyForecast(data);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        locationElement.textContent = 'Error: ' + error.message;
        weatherIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    const current = data.current;
    const location = data.location;
    
    locationElement.textContent = `${location.name}, ${location.country}`;
    tempElement.textContent = Math.round(current.temp_c);
    weatherDescription.textContent = current.condition.text;
    feelsLike.textContent = `Feels like: ${Math.round(current.feelslike_c)}°C`;
    windElement.textContent = `${current.wind_kph} km/h`;
    humidityElement.textContent = `${current.humidity}%`;
    precipitationElement.textContent = `${current.precip_mm} mm`;
    visibilityElement.textContent = `${current.vis_km} km`;
    
    // Set weather icon based on condition code
    const conditionCode = current.condition.code;
    let weatherIconClass = getWeatherIcon(conditionCode, current.is_day);
    
    weatherIcon.innerHTML = `<i class="${weatherIconClass} floating"></i>`;
    
    // Adjust theme based on weather
    const mainWeather = current.condition.text.toLowerCase();
    if (mainWeather.includes('thunder')) {
        setThunderTheme();
    } else if (mainWeather.includes('rain') || mainWeather.includes('drizzle') || mainWeather.includes('shower')) {
        setRainTheme();
    } else {
        setForestTheme();
    }
}

// Get appropriate Font Awesome icon based on WeatherAPI condition code
function getWeatherIcon(conditionCode, isDay) {
    // Daytime icons
    if (isDay) {
        switch(conditionCode) {
            case 1000: return 'fas fa-sun'; // Sunny
            case 1003: return 'fas fa-cloud-sun'; // Partly cloudy
            case 1006: return 'fas fa-cloud'; // Cloudy
            case 1009: return 'fas fa-cloud'; // Overcast
            case 1030: return 'fas fa-smog'; // Mist
            case 1063: return 'fas fa-cloud-rain'; // Patchy rain
            case 1066: return 'fas fa-snowflake'; // Patchy snow
            case 1069: return 'fas fa-cloud-meatball'; // Sleet
            case 1072: return 'fas fa-icicles'; // Freezing drizzle
            case 1087: return 'fas fa-bolt'; // Thundery outbreaks
            case 1114: return 'fas fa-wind'; // Blowing snow
            case 1117: return 'fas fa-wind'; // Blizzard
            case 1135: return 'fas fa-smog'; // Fog
            case 1147: return 'fas fa-smog'; // Freezing fog
            case 1150: return 'fas fa-cloud-rain'; // Patchy light drizzle
            case 1153: return 'fas fa-cloud-rain'; // Light drizzle
            case 1168: return 'fas fa-icicles'; // Freezing drizzle
            case 1171: return 'fas fa-icicles'; // Heavy freezing drizzle
            case 1180: return 'fas fa-cloud-rain'; // Patchy light rain
            case 1183: return 'fas fa-cloud-rain'; // Light rain
            case 1186: return 'fas fa-cloud-showers-heavy'; // Moderate rain
            case 1189: return 'fas fa-cloud-showers-heavy'; // Heavy rain
            case 1192: return 'fas fa-cloud-showers-heavy'; // Heavy rain
            case 1195: return 'fas fa-cloud-showers-heavy'; // Torrential rain
            case 1198: return 'fas fa-icicles'; // Light freezing rain
            case 1201: return 'fas fa-icicles'; // Moderate/heavy freezing rain
            case 1204: return 'fas fa-cloud-meatball'; // Light sleet
            case 1207: return 'fas fa-cloud-meatball'; // Moderate/heavy sleet
            case 1210: return 'fas fa-snowflake'; // Patchy light snow
            case 1213: return 'fas fa-snowflake'; // Light snow
            case 1216: return 'fas fa-snowflake'; // Patchy moderate snow
            case 1219: return 'fas fa-snowflake'; // Moderate snow
            case 1222: return 'fas fa-snowflake'; // Patchy heavy snow
            case 1225: return 'fas fa-snowflake'; // Heavy snow
            case 1237: return 'fas fa-snowflake'; // Ice pellets
            case 1240: return 'fas fa-cloud-showers-heavy'; // Light rain shower
            case 1243: return 'fas fa-cloud-showers-heavy'; // Moderate/heavy rain shower
            case 1246: return 'fas fa-cloud-showers-heavy'; // Torrential rain shower
            case 1249: return 'fas fa-cloud-meatball'; // Light sleet showers
            case 1252: return 'fas fa-cloud-meatball'; // Moderate/heavy sleet showers
            case 1255: return 'fas fa-snowflake'; // Light snow showers
            case 1258: return 'fas fa-snowflake'; // Moderate/heavy snow showers
            case 1261: return 'fas fa-icicles'; // Light showers of ice pellets
            case 1264: return 'fas fa-icicles'; // Moderate/heavy showers of ice pellets
            case 1273: return 'fas fa-bolt'; // Patchy light rain with thunder
            case 1276: return 'fas fa-bolt'; // Moderate/heavy rain with thunder
            case 1279: return 'fas fa-bolt'; // Patchy light snow with thunder
            case 1282: return 'fas fa-bolt'; // Moderate/heavy snow with thunder
            default: return 'fas fa-question';
        }
    } 
    // Nighttime icons
    else {
        switch(conditionCode) {
            case 1000: return 'fas fa-moon'; // Clear
            case 1003: return 'fas fa-cloud-moon'; // Partly cloudy
            case 1006: return 'fas fa-cloud'; // Cloudy
            case 1009: return 'fas fa-cloud'; // Overcast
            case 1030: return 'fas fa-smog'; // Mist
            case 1063: return 'fas fa-cloud-moon-rain'; // Patchy rain
            case 1066: return 'fas fa-snowflake'; // Patchy snow
            case 1069: return 'fas fa-cloud-meatball'; // Sleet
            case 1072: return 'fas fa-icicles'; // Freezing drizzle
            case 1087: return 'fas fa-bolt'; // Thundery outbreaks
            case 1114: return 'fas fa-wind'; // Blowing snow
            case 1117: return 'fas fa-wind'; // Blizzard
            case 1135: return 'fas fa-smog'; // Fog
            case 1147: return 'fas fa-smog'; // Freezing fog
            case 1150: return 'fas fa-cloud-moon-rain'; // Patchy light drizzle
            case 1153: return 'fas fa-cloud-moon-rain'; // Light drizzle
            case 1168: return 'fas fa-icicles'; // Freezing drizzle
            case 1171: return 'fas fa-icicles'; // Heavy freezing drizzle
            case 1180: return 'fas fa-cloud-moon-rain'; // Patchy light rain
            case 1183: return 'fas fa-cloud-moon-rain'; // Light rain
            case 1186: return 'fas fa-cloud-showers-heavy'; // Moderate rain
            case 1189: return 'fas fa-cloud-showers-heavy'; // Heavy rain
            case 1192: return 'fas fa-cloud-showers-heavy'; // Heavy rain
            case 1195: return 'fas fa-cloud-showers-heavy'; // Torrential rain
            case 1198: return 'fas fa-icicles'; // Light freezing rain
            case 1201: return 'fas fa-icicles'; // Moderate/heavy freezing rain
            case 1204: return 'fas fa-cloud-meatball'; // Light sleet
            case 1207: return 'fas fa-cloud-meatball'; // Moderate/heavy sleet
            case 1210: return 'fas fa-snowflake'; // Patchy light snow
            case 1213: return 'fas fa-snowflake'; // Light snow
            case 1216: return 'fas fa-snowflake'; // Patchy moderate snow
            case 1219: return 'fas fa-snowflake'; // Moderate snow
            case 1222: return 'fas fa-snowflake'; // Patchy heavy snow
            case 1225: return 'fas fa-snowflake'; // Heavy snow
            case 1237: return 'fas fa-snowflake'; // Ice pellets
            case 1240: return 'fas fa-cloud-showers-heavy'; // Light rain shower
            case 1243: return 'fas fa-cloud-showers-heavy'; // Moderate/heavy rain shower
            case 1246: return 'fas fa-cloud-showers-heavy'; // Torrential rain shower
            case 1249: return 'fas fa-cloud-meatball'; // Light sleet showers
            case 1252: return 'fas fa-cloud-meatball'; // Moderate/heavy sleet showers
            case 1255: return 'fas fa-snowflake'; // Light snow showers
            case 1258: return 'fas fa-snowflake'; // Moderate/heavy snow showers
            case 1261: return 'fas fa-icicles'; // Light showers of ice pellets
            case 1264: return 'fas fa-icicles'; // Moderate/heavy showers of ice pellets
            case 1273: return 'fas fa-bolt'; // Patchy light rain with thunder
            case 1276: return 'fas fa-bolt'; // Moderate/heavy rain with thunder
            case 1279: return 'fas fa-bolt'; // Patchy light snow with thunder
            case 1282: return 'fas fa-bolt'; // Moderate/heavy snow with thunder
            default: return 'fas fa-question';
        }
    }
}

// Update hourly forecast
function updateHourlyForecast(data) {
    hourlyForecast.innerHTML = '';
    
    // Get next 8 hours (24-hour forecast from API)
    for (let i = 0; i < 8; i++) {
        const forecast = data.forecast.forecastday[0].hour[i];
        const time = new Date(forecast.time);
        const hours = time.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        const iconClass = getWeatherIcon(forecast.condition.code, forecast.is_day);
        
        let iconColor = 'text-gray-300';
        if (iconClass.includes('sun') || iconClass.includes('moon')) iconColor = 'text-yellow-300';
        if (iconClass.includes('rain')) iconColor = 'text-blue-300';
        if (iconClass.includes('bolt')) iconColor = 'text-purple-300';
        if (iconClass.includes('snowflake')) iconColor = 'text-blue-100';
        
        const forecastElement = document.createElement('div');
        forecastElement.className = 'flex flex-col items-center justify-center bg-white bg-opacity-30 rounded-xl p-3 min-w-[70px] md:min-w-[80px] card-hover';
        forecastElement.innerHTML = `
            <p class="text-white text-sm">${displayHours}${ampm}</p>
            <div class="text-2xl md:text-3xl my-1 ${iconColor}">
                <i class="${iconClass} floating"></i>
            </div>
            <p class="text-lg font-bold text-white">${Math.round(forecast.temp_c)}°</p>
        `;
        
        hourlyForecast.appendChild(forecastElement);
    }
}

// Update daily forecast
function updateDailyForecast(data) {
    dailyForecast.innerHTML = '';
    
    // Get daily forecast (next 5 days)
    for (let i = 0; i < 5; i++) {
        const forecast = data.forecast.forecastday[i];
        const date = new Date(forecast.date);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const iconClass = getWeatherIcon(forecast.day.condition.code, true);
        
        let iconColor = 'text-gray-300';
        if (iconClass.includes('sun') || iconClass.includes('moon')) iconColor = 'text-yellow-300';
        if (iconClass.includes('rain')) iconColor = 'text-blue-300';
        if (iconClass.includes('bolt')) iconColor = 'text-purple-300';
        if (iconClass.includes('snowflake')) iconColor = 'text-blue-100';
        
        const forecastElement = document.createElement('div');
        forecastElement.className = 'flex justify-between items-center py-2 md:py-3 border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 rounded-lg px-3 md:px-4 transition card-hover';
        forecastElement.innerHTML = `
            <p class="text-white font-medium">${i === 0 ? 'Today' : day}</p>
            <div class="flex items-center">
                <div class="text-xl md:text-2xl ${iconColor} mr-3 md:mr-4">
                    <i class="${iconClass} floating"></i>
                </div>
                <div class="text-white font-bold">${Math.round(forecast.day.maxtemp_c)}° / ${Math.round(forecast.day.mintemp_c)}°</div>
            </div>
        `;
        
        dailyForecast.appendChild(forecastElement);
    }
}

// Create leaves for forest theme
function createLeaves() {
    leavesContainer.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.top = `${Math.random() * 100}%`;
        leaf.style.animationDuration = `${10 + Math.random() * 20}s`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leavesContainer.appendChild(leaf);
    }
}

// Create thunder effects
function createThunderEffects() {
    thunderContainer.innerHTML = '';
    
    // Add random lightning flashes
    for (let i = 0; i < 3; i++) {
        const lightning = document.createElement('div');
        lightning.style.position = 'absolute';
        lightning.style.top = `${Math.random() * 30}%`;
        lightning.style.height = '100%';
        lightning.style.width = '100%';
        lightning.style.background = 'linear-gradient(to right, transparent, white, transparent)';
        lightning.style.opacity = '0';
        lightning.style.animation = `lightning ${8 + Math.random() * 5}s linear infinite`;
        lightning.style.animationDelay = `${Math.random() * 10}s`;
        thunderContainer.appendChild(lightning);
    }
}

// Forest theme
function setForestTheme() {
    body.className = 'min-h-screen bg-gradient-to-b from-green-700 to-green-900 theme-transition';
    currentWeather.classList.remove('lightning-effect', 'rain-effect', 'thunder-shake');
    currentWeather.classList.add('pulse');
    createLeaves();
    
    // Add floating animation to all weather icons
    document.querySelectorAll('.fa-sun, .fa-cloud, .fa-cloud-sun, .fa-cloud-rain, .fa-moon, .fa-bolt, .fa-snowflake').forEach(icon => {
        icon.classList.add('floating');
    });
}

// Thunder theme
function setThunderTheme() {
    body.className = 'min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 theme-transition';
    currentWeather.classList.remove('rain-effect', 'pulse');
    currentWeather.classList.add('lightning-effect', 'thunder-shake');
    createThunderEffects();
    leavesContainer.innerHTML = '';
    
    // Add shake animation to all weather icons
    document.querySelectorAll('.fa-sun, .fa-cloud, .fa-cloud-sun, .fa-cloud-rain, .fa-moon, .fa-bolt, .fa-snowflake').forEach(icon => {
        icon.classList.add('thunder-shake');
    });
}

// Rain theme
function setRainTheme() {
    body.className = 'min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 theme-transition';
    currentWeather.classList.remove('lightning-effect', 'pulse', 'thunder-shake');
    currentWeather.classList.add('rain-effect');
    leavesContainer.innerHTML = '';
    thunderContainer.innerHTML = '';
    
    // Add floating animation to all weather icons
    document.querySelectorAll('.fa-sun, .fa-cloud, .fa-cloud-sun, .fa-cloud-rain, .fa-moon, .fa-bolt, .fa-snowflake').forEach(icon => {
        icon.classList.add('floating');
    });
}

// Theme buttons
forestBtn.addEventListener('click', setForestTheme);
thunderBtn.addEventListener('click', setThunderTheme);
rainBtn.addEventListener('click', setRainTheme);