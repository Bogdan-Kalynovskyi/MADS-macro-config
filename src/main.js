/* eslint-disable no-console */
/* global window, XMLHttpRequest */
import Mads from 'mads-custom';
import {getText, getParamsFromJson, macrosInParams} from './js/getPropsFromJson';
import getEnvVars from './js/getConditions'

import './main.css';
import json from './config.js';


class AdUnit extends Mads {

  constructor(getLocally) {
    super();
    this.json = null;
    if (getLocally) {
      const conditions = {};
      const inputs = document.querySelectorAll('input, select');
      for (const input of inputs) {
        const conditionName = input.id;
        conditions[conditionName] = input.value;
      }
      setTimeout(() => this.doInit(conditions), 500);
    }
    else {
      getEnvVars.then(conditions => {
        this.doInit(conditions);
        this.initForm(conditions);
      });
    }
  }


  doInit(conditions) {
    const conditionsLowercase = {};
    for (let i in conditions) {
        conditionsLowercase[i] = conditions[i].toLocaleLowerCase();
    }
    this.params = getParamsFromJson(json, conditionsLowercase);
    this.params = macrosInParams(this.params, conditions);
    this.finalRender();
  }


  initForm(conditions) {
    try {
        for (let i in conditions) {
            document.getElementById(i).value = conditions[i];
        }
    } catch (e) {}
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
      <h1 id="ad-headline"${style.headline}>${getText(this.params.headline)}</h1>
      <p id="ad-description"${style.description}>${getText(this.params.description)}</p>
      <a id="ad-cta" href="${this.params.cta.url}">${style.cta}${getText(this.params.cta)}</a>
    `;
  }

  // todo put styles here
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