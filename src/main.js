/* eslint-disable no-console */
/* global window, XMLHttpRequest */
import Mads from 'mads-custom';
import {getText, getParamsFromJson, macrosInParams} from './js/replaceInJson';
import getEnvVars from './js/getEnvironmentVars'

import './main.css';

import json from './config.js';


class AdUnit extends Mads {

  constructor() {
    super();
    this.json = null;
    getEnvVars.then(conditions => {
      this.params = getParamsFromJson(json, conditions);
      this.params = macrosInParams(this.params, conditions);
      this.finalRender();
    });
  }

  render() {
    return `
      <div id="ad-container"></div>
    `;
  }

  finalRender() {
    const style = {};
    for (let i in this.params) {
      style[i] = this.params[i].style ? ` style="${this.params[i].style}"` : '';
    }

    const backgroundNode = this.params.creative.type === "image" ?
      `<img id="ad-background" src="${this.params.creative.url}" alt=""${style.creative}>`
      :
      `<video id="ad-background" width="100%" height="100%" autoplay${style.creative}>
        <source src="${this.params.creative.url}">
      </video>`;


    document.getElementById('ad-container').innerHTML = `
      ${backgroundNode}
      <h1 id="ad-heading"${style.heading}>${getText(this.params.headline)}</h1>
      <p id="ad-description"${style.description}>${getText(this.params.description)}</p>
      <div style="text-align: center">
        <a id="ad-cta" href="${this.params.cta.url}">${style.cta}${getText(this.params.cta)}</a>
      </div>
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
