var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

module.exports = {
    lerp,
};
