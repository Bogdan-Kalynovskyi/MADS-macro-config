const date = new Date();
const time = date.toLocaleString(language, { hour: 'numeric', hour12: true });
const language = navigator.language;
const day = date.toLocaleString(language, {  weekday: 'long' });
const screenWidth = window.innerWidth;
const device = screenWidth < 756 ? 'Mobile' : (screenWidth < 1024 ? 'Tablet' : 'Desktop');
const os = navigator.platform;
var country = "",
    city = "",
    weather = "";

const getEnvironmentPromise = new Promise((resolve, reject) => {
  try {
    var xmlhttpLocation = new XMLHttpRequest();

    xmlhttpLocation.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {

        var locationResponse = JSON.parse(this.responseText);
        city = locationResponse.city;
        country = locationResponse.city;

        try {
          var xmlhttpWeather = new XMLHttpRequest();

          xmlhttpWeather.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

              var weatherResponse = JSON.parse(this.response);
              weather = "Temperature: " + weatherResponse.main.temp + ". " + weatherResponse.weather[0].main;
              alert(weather);

            }
          };

          xmlhttpWeather.open('GET', "http://api.openweathermap.org/data/2.5/weather?" +
            "lat=" + locationResponse.lat + '&' +
            "lon=" + locationResponse.lon + '&' +
            "units=metric" + '&' +
            "APPID=05233ff759e21c294b058dfe648b690b",
            true);
          xmlhttpWeather.send();
        }
        catch (e) {
          reject(e);
        }

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

    xmlhttpLocation.open('GET', 'http://ip-api.com/json/', true);
    xmlhttpLocation.send();
  }
  catch (e) {
    reject(e);
  }
});

export default getEnvironmentPromise;