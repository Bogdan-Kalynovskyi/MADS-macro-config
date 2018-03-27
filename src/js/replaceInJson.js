// const conditionNames = ['time', 'day', 'language', 'device', 'os', 'country', 'city', 'weather'];


export function getParamsFromJson(json, conditions) {

    function simpleCondition(query, branch) {
        const conditionValue = conditions[query];
        for (const value in branch) {
            if (value === conditionValue) {
                return recursive(branch[value]);
            }
        }
        return eventuallyOther(branch);
    }

    function complexCondition(query, branch) {
        const queryParts = query.split('&&');
        const conditionParts = [];
        for (let query of queryParts) {
            conditionParts.push(conditions[query]);
        }
        for (const value in branch) {
            const valueParts = value.split('&&');
            for (var i = 0; i < valueParts.length; i++) {
                const part = valueParts[i];
                if (part === 'ANY' || part === conditionParts[i]) {
                    break;
                }
            }
            if (i < valueParts.length) {
                return recursive(branch[value]);
            }
        }
        return eventuallyOther(branch);
    }

    function eventuallyOther(branch) {
        const otherBranch = branch["Other"];
        if (otherBranch) {
            return recursive(otherBranch);
        }
        return '';
    }

    function recursive(branch) {
        if (typeof branch === 'string') {
            return branch;
        }
        const objectKeys = Object.keys(branch);
        if (objectKeys.length === 1) {
            const query = objectKeys[0];
            const subBranch = branch[query];
            if (query.indexOf('&&') === -1) {
                return simpleCondition(query, subBranch);
            }
            else {
                return complexCondition(query, subBranch);
            }
        }
        return branch;
    }


    const params = {};

    for (const paramName in json) {
        params[paramName] = recursive(json[paramName])
    }

    return params;
}


   
export function macrosInParams(params, conditions) {
    const replaceMacros = (string) => {
        for (const i in conditions) {
            string = string.replace('{{' + i + '}}', conditions[i]);
        }
        return string;
    };

    for (const paramName in params) {
        const param = params[paramName];
        if (typeof param === "string") {
            params[paramName] = replaceMacros(param);
        }
        else {
            const text = param.text;
            if (typeof text === "string") {
                params[paramName].text = replaceMacros(text);
            }
            else if (text instanceof Array) {
                params[paramName].text = replaceMacros(text[Math.floor(Math.random() * text.length)]);
            }
        }
    }
    return params;
}


export function getText(param) {
    if (typeof param === "string") {
        return param;
    }
    return param.text;
}
