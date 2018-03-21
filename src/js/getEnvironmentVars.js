const language = navigator.language;
const date = new Date();
const time = date.toLocaleString(language, { hour: 'numeric', hour12: true });
const day = date.toLocaleString(language, {  weekday: 'long' });
const os = navigator.platform;
const screenWidth = window.innerWidth;
const device = screenWidth < 756 ? 'Mobile' : (screenWidth < 1024 ? 'Tablet' : 'Desktop');

const locationPromise = new Promise((resolve, reject) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        debugger;

        resolve({
          language,
          time,
          day,
          os,
          device,
        });
      }
    });

    xhr.open('GET', 'http://freegeoip.net/json/');
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.send();
  }
  catch (e) {
    reject(e);
  }
});

export default locationPromise;