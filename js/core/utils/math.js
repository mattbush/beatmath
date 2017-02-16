const _ = require('lodash');

const DEG_2_RAD = Math.PI / 180;
const RAD_2_DEG = 180 / Math.PI;

const nextFloat = function(x) {
    return Math.random() * x;
};

const lerp = function(min, max, interpolation) {
    return min + (max - min) * interpolation;
};

const logerp = function(min, max, interpolation) {
    return min * ((max / min) ** interpolation);
};

const arclerp = function(min, max, value) {
    return (value - min) / (max - min);
};

const clamp = function(val, min, max) {
    return Math.min(max, Math.max(min, val));
};

const modAndShiftToHalf = function(dividend, divisor) {
    const mod = (dividend + divisor) % divisor;
    return (mod > divisor / 2) ? (mod - divisor) : mod;
};

const modAndShiftToHalfZigzag = function(dividend, divisor) {
    const mod = (dividend + divisor) % divisor;
    const value = (mod > divisor / 2) ? (mod - divisor) : mod;
    const quotient = (Math.round(dividend / divisor));
    return quotient % 2 ? -value : value;
};

const posModAndBendToLowerHalf = function(dividend, divisor) {
    const mod = (dividend + divisor) % divisor;
    return (mod > divisor / 2) ? (divisor - mod) : mod;
};

const dist = function(a, b) {
    return Math.sqrt(a * a + b * b);
};

const polarAngleDeg = function(x, y) {
    return Math.atan2(y, x) * RAD_2_DEG;
};

const manhattanDist = function(a, b) {
    return Math.abs(a) + Math.abs(b);
};

const triangularDist = function(x, y) {
    const deg = modAndShiftToHalf(polarAngleDeg(x, y) - 90, 120);
    return dist(x, y) * Math.cos(deg * DEG_2_RAD);
};

const xyFromPolarAngleAndRadius = function(polarAngleInDegrees, radius) {
    const angleInRadians = polarAngleInDegrees * DEG_2_RAD;
    return {
        x: Math.cos(angleInRadians) * radius,
        y: Math.sin(angleInRadians) * radius,
    };
};

const xyRotatedAroundOriginWithAngle = function(x, y, angleInDegrees) {
    const angleInRadians = angleInDegrees * DEG_2_RAD;
    const cos = Math.cos(angleInRadians);
    const sin = Math.sin(angleInRadians);
    return [
        cos * x - sin * y,
        sin * x + cos * y,
    ];
};

const posMod = function(dividend, divisor) {
    const remainder = dividend % divisor;
    return remainder < 0 ? remainder + divisor : remainder;
};

const ceilOfMultiple = function(x, multiple) {
    return Math.ceil(x / multiple) * multiple;
};

const centerOfPoints = function(points) {
    return points[0].map((ignoreValue, index) => {
        return _.reduce(
            _.map(points, point => point[index]),
            (a, b) => a + b,
        ) / points.length;
    });
};

module.exports = {
    nextFloat,
    lerp,
    logerp,
    arclerp,
    clamp,
    dist,
    manhattanDist,
    triangularDist,
    polarAngleDeg,
    xyFromPolarAngleAndRadius,
    posMod,
    ceilOfMultiple,
    modAndShiftToHalf,
    modAndShiftToHalfZigzag,
    posModAndBendToLowerHalf,
    centerOfPoints,
    xyRotatedAroundOriginWithAngle,
};
