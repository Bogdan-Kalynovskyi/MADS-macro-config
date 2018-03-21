import json from "./dco";

export const jsonParamsExtractor = (json, envVars) => {
  for (let paramName in json) {
      const feature = json[paramName];
      let featureParams = feature[inputString];
      if (!featureParams) {
          featureParams = feature["Other"];
      }

      // ! todo cache
      const replaces = getReplaces(inputString);

      if (typeof featureParams === 'string') {
          for (let replaceFrom in replaces) {
              featureParams = stringReplace(replaceFrom, replaces, featureParams);
          }
      }
      else {
          for (let paramKey in featureParams) {
              const paramValue = featureParams[paramKey];

              for (let replaceFrom in replaces) {
                  featureParams[paramKey] = stringReplace(replaceFrom, replaces, paramValue);
              }
          }
      }
      return featureParams; // json[paramName]
  }
};


const getReplaces = (inputString) => {
  const vars = inputString.split('&&').map(string => string.trim());
  return {
    day: vars[0],
    language: vars[1],
    weather: vars[2]
  }
};


const stringReplace = (from, toList, haystack) => {
  const to = toList[from];
  return haystack.replace('{{' + from + '}}', to);
};