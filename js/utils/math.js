var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

var dist = function(a, b) {
    return Math.sqrt(a * a + b * b);
};

var manhattanDist = function(a, b) {
    return Math.abs(a) + Math.abs(b);
};

var polarAngleDeg = function(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
};

var posMod = function(dividend, divisor) {
    var remainder = dividend % divisor;
    return remainder < 0 ? remainder + divisor : remainder;
};

var modAndShiftToHalf = function(dividend, divisor) {
    var remainder = dividend % divisor;
    var mod = remainder < 0 ? remainder + divisor : remainder;
    return (mod > divisor / 2) ? (mod - divisor) : mod;
};

var posModAndBendToLowerHalf = function(dividend, divisor) {
    var remainder = dividend % divisor;
    var mod = remainder < 0 ? remainder + divisor : remainder;
    return (mod > divisor / 2) ? (divisor - mod) : mod;
};

module.exports = {
    lerp,
    dist,
    manhattanDist,
    polarAngleDeg,
    posMod,
    modAndShiftToHalf,
    posModAndBendToLowerHalf,
};
