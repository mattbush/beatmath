var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

var posMod = function(divident, divisor) {
    var remainder = divident % divisor;
    return remainder < 0 ? remainder + divisor : remainder;
};

module.exports = {
    lerp,
    posMod,
};
