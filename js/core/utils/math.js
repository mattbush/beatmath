var nextFloat = function(x) {
    return Math.random() * x;
};

var lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

var constrainToRange = function(min, max, val) {
    return Math.min(max, Math.max(min, val));
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

var ceilOfMultiple = function(x, multiple) {
    return Math.ceil(x / multiple) * multiple;
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
    nextFloat,
    lerp,
    constrainToRange,
    dist,
    manhattanDist,
    polarAngleDeg,
    posMod,
    ceilOfMultiple,
    modAndShiftToHalf,
    posModAndBendToLowerHalf,
};
