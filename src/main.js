/* eslint-disable no-console */
/* global window, XMLHttpRequest */
import Mads from 'mads-custom';
import {getParamsFromJson, processMacrosInParams} from './js/getPropsFromJson';
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
    const conditionsLowerCase = {};
    for (let i in conditions) {
        conditionsLowerCase[i] = conditions[i].toLowerCase();
    }
    this.params = getParamsFromJson(json, conditionsLowerCase);
    this.params = processMacrosInParams(this.params, conditions);
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
    const ad = this.params;

    const backgroundNode = ad.creative.type === "image" ?
      `<img id="ad-background" src="${ad.creative.url}" alt=""${ad.creative.style}>`
      :
      `<video id="ad-background" width="100%" height="100%" autoplay${ad.creative.style}>
        <source src="${ad.creative.url}">
      </video>`;


    document.getElementById('ad-container').innerHTML = `
      ${backgroundNode}
      <h1 id="ad-headline"${ad.headline.style}>${ad.headline.text}</h1>
      <p id="ad-description"${ad.description.style}>${ad.description.text}</p>
      <a id="ad-cta"${ad.cta.style} href="${ad.cta.url}">${ad.cta.text}</a>
    `;
  }

  // todo put styles here
  style() {
    return '';
  }

  events() {};

}

window.ad = new AdUnit();


window.AdUnit = AdUnit;