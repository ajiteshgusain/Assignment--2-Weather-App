const API_KEY = 'e5fc5d7710dca57ef2914844eb194684';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const historyList = document.getElementById('historyList');
const eventLog = document.getElementById('eventLog');

// Helper to log to our UI "Console"
function logToUI(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    eventLog.appendChild(p);
}

// 1. Fetch Weather Data
async function fetchWeather(city) {
    eventLog.innerHTML = ""; // Clear log for new search
    
    logToUI("Sync: Start"); // [cite: 60]
    
    try {
        logToUI("ASYNC: Start fetching..."); // [cite: 62]
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) throw new Error("City not found"); // [cite: 37, 39]

        const data = await response.json();
        
        // Simulating a Macrotask to show event loop behavior [cite: 63, 74]
        setTimeout(() => {
            logToUI("setTimeout: (Macrotask) - This ran last!");
        }, 0);

        displayWeather(data);
        saveToHistory(city);
        logToUI("ASYNC: Data received"); // [cite: 75]

    } catch (error) {
        weatherDisplay.innerHTML = `<p style="color: red;">${error.message}</p>`; // [cite: 65]
        logToUI(`Error: ${error.message}`);
    }

    logToUI("Sync: End"); // [cite: 61]
}

// 2. Display weather in the UI [cite: 33]
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <p><strong>City:</strong> ${data.name}, ${data.sys.country}</p>
        <p><strong>Temp:</strong> ${data.main.temp}°C</p>
        <p><strong>Weather:</strong> ${data.weather[0].main}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    `;
}

// 3. Local Storage for History [cite: 43, 44]
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    historyList.innerHTML = history.map(city => 
        `<button class="history-btn" onclick="fetchWeather('${city}')">${city}</button>`
    ).join(''); // [cite: 46]
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Load history on page start [cite: 45]
window.onload = renderHistory;