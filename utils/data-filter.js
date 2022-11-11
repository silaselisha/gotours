const dataSanitizer = (dataObject, ...items) => {
    const sanitizedObject = {};

    Object.keys(dataObject).forEach(item => {
        if(items.includes(item)) {
            sanitizedObject[item] = dataObject[item];
        }
    })
    
    return sanitizedObject;
}

module.exports = dataSanitizer;