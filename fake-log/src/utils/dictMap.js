function getByValue(dictionary, index, value, def = {}) {
    const val = dictionary.filter(obj => {
        return obj[index] === value;
    })[0];

    if (!val) return def;
    return val;
}

exports.getByValue = getByValue;
