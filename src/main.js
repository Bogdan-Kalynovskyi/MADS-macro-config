/* eslint-disable no-console */
/* global window, XMLHttpRequest */
import Mads from 'mads-custom';
import {jsonParamsExtractor} from './js/replaceInJson';
import getEnvVars from './js/getEnvironmentVars'

import './main.css';

import json from './js/dco.js';


class AdUnit extends Mads {

  constructor() {
    super();
    getEnvVars.then(envVars => {
      this.params = jsonParamsExtractor(json, envVars);
      this.finalRender();
    });
  }

  render() {
    return `
      <div id="ad-container"></div>
    `;
  }

  finalRender() {
    const backgroundNode = this.params.creative.type === "image" ?
      `<img id="ad-background" src="${this.params.creative.url}" alt="">`
      :
      `<video id="ad-background" width="100%" height="100%" autoplay>
        <source src="${this.params.creative.url}">
      </video>`;

    document.getElementById('ad-container').innerHTML = `
      ${backgroundNode}
      <h1 id="ad-heading">${this.params.headline}</h1>
      <p id="ad-description">${this.params.description}</p>
      <a id="ad-cta" href="${this.params.cta.url}">${this.params.cta.label}</a>
    `;
  }

  style() {
    return '';
  }

  events() {
    return new Promise((resolve, reject) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
              this.tracker('E', 'uploaded');
              resolve('');
            }
          });

          xhr.open('POST', 'https://www.mobileads.com/upload-image-twtbk');
          xhr.setRequestHeader('cache-control', 'no-cache');

          xhr.send();
        } catch (e) {
          reject(e);
        }
      });
    };

}

window.ad = new AdUnit();


window.AdUnit = AdUnit;