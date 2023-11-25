
const filterObj = (obj, ...allowedKeys) => {
    const newObj = {};

    Object.keys(obj).forEach((el) => {
        if (allowedKeys.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
};

module.exports = filterObj



