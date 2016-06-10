const nextFloat = function(x) {
    return Math.random() * x;
};

const lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

const logerp = function(min, max, interpolation) {
    return min * ((max / min) ** interpolation);
};

const clamp = function(val, min, max) {
    return Math.min(max, Math.max(min, val));
};

const dist = function(a, b) {
    return Math.sqrt(a * a + b * b);
};

const manhattanDist = function(a, b) {
    return Math.abs(a) + Math.abs(b);
};

const polarAngleDeg = function(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
};

const xyFromPolarAngleAndRadius = function(polarAngleInDegrees, radius) {
    const angleInRadians = polarAngleInDegrees * Math.PI / 180;
    return {
        x: Math.cos(angleInRadians) * radius,
        y: Math.sin(angleInRadians) * radius,
    };
};

const posMod = function(dividend, divisor) {
    const remainder = dividend % divisor;
    return remainder < 0 ? remainder + divisor : remainder;
};

const ceilOfMultiple = function(x, multiple) {
    return Math.ceil(x / multiple) * multiple;
};

const modAndShiftToHalf = function(dividend, divisor) {
    const remainder = dividend % divisor;
    const mod = remainder < 0 ? remainder + divisor : remainder;
    return (mod > divisor / 2) ? (mod - divisor) : mod;
};

const posModAndBendToLowerHalf = function(dividend, divisor) {
    const remainder = dividend % divisor;
    const mod = remainder < 0 ? remainder + divisor : remainder;
    return (mod > divisor / 2) ? (divisor - mod) : mod;
};

module.exports = {
    nextFloat,
    lerp,
    logerp,
    clamp,
    dist,
    manhattanDist,
    polarAngleDeg,
    xyFromPolarAngleAndRadius,
    posMod,
    ceilOfMultiple,
    modAndShiftToHalf,
    posModAndBendToLowerHalf,
};
