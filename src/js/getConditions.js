import {getLanguageName} from "./languageNameFromCode";

const date = new Date();
const time = date.toLocaleString('en', { hour: 'numeric', hour12: true });
let   language = navigator.language || navigator.userLanguage;
// language = language.split('-')[0];
language = getLanguageName(language);
const day = date.toLocaleString('en', {  weekday: 'long' });
const screenWidth = window.innerWidth;
const device = screenWidth <= 768 ? 'Mobile' : (screenWidth <= 1024 ? 'Tablet' : 'Desktop');
const os = navigator.platform;


function weatherDictionary(inputWeather) {
    const map = {
        'Clouds': 'Cloudy',
        'Clear': 'Sunny',
        'Rain': 'Rainy'
    };
    return map[inputWeather] || '?';
}


const getEnvironmentPromise = new Promise((resolve, reject) => {
  try {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {

        const locationResponse = JSON.parse(request.responseText);
        const city = locationResponse.city;
        const country = locationResponse.country;

        request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status === 200) {

            const weatherResponse = JSON.parse(request.response);
            const weather = weatherDictionary(weatherResponse.weather[0].main);

            resolve({
                time,
                day,
                language,
                device,
                os,
                country,
                city,
                weather
            });
          }
        };

        request.open('GET', "http://api.openweathermap.org/data/2.5/weather?" +
          "lat=" + locationResponse.lat + '&' +
          "lon=" + locationResponse.lon + '&' +
          "units=metric" + '&' +
          "APPID=05233ff759e21c294b058dfe648b690b",
          true);
        request.send();
      }
    };

    request.open('GET', 'http://ip-api.com/json/', true);
    request.send();
  }
  catch (e) {
    reject(e);
  }
});

export default getEnvironmentPromise;