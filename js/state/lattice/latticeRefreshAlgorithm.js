const {PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');
const {posMod} = require('js/utils/math');

const DIAMOND_SIZE = 10;
const NUM_DIAMOND_SPIRALS = 0;
var DIAMOND_REFRESH_ALGORITHM = function(row, col) {
    var polarAngle = Math.atan2(col, row) * 180 / Math.PI;
    var rowMod10 = posMod(row, DIAMOND_SIZE);
    var colMod10 = posMod(col, DIAMOND_SIZE);
    var half = DIAMOND_SIZE / 2;
    rowMod10 = (rowMod10 > half) ? (DIAMOND_SIZE - rowMod10) : rowMod10;
    colMod10 = (colMod10 > half) ? (DIAMOND_SIZE - colMod10) : colMod10;
    return ((((0.5 + rowMod10 + colMod10) / DIAMOND_SIZE + (polarAngle * NUM_DIAMOND_SPIRALS / 360)) + NUM_DIAMOND_SPIRALS) % 1) * PIXEL_REFRESH_RATE;
};

// 10, 0|1, 0|1 is standard
// 3.5-4, 1, 2 is a nice combo
const RIPPLE_RADIUS = 12;
const NUM_SPIRALS = 1;
const MANHATTAN_COEFFICIENT = 0;
var RIPPLE_REFRESH_ALGORITHM = function(row, col) {
    var polarAngle = Math.atan2(col, row) * 180 / Math.PI;
    var manhattanDistance = Math.abs(col) + Math.abs(row);
    var euclideanDistance = Math.sqrt(col * col + row * row);
    var distance = (MANHATTAN_COEFFICIENT * manhattanDistance + (1 - MANHATTAN_COEFFICIENT) * euclideanDistance);
    return (((distance / RIPPLE_RADIUS + (polarAngle * NUM_SPIRALS / 360)) + NUM_SPIRALS) % 1) * PIXEL_REFRESH_RATE;
//    return (((Math.log(distance / RIPPLE_RADIUS) + (polarAngle * NUM_SPIRALS / 360)) + NUM_SPIRALS + 10) % 1) * PIXEL_REFRESH_RATE;
};

const NUM_SECTORS = 6;
const SECTOR_SIZE = 360 / NUM_SECTORS;
var SECTOR_REFRESH_ALGORITHM = function(row, col) {
    var polarAngle = Math.atan2(col, row) * 180 / Math.PI;
    polarAngle += 360;
    var polarAngleMod = polarAngle % SECTOR_SIZE;
    if (polarAngleMod > SECTOR_SIZE / 2) {
        polarAngleMod = SECTOR_SIZE - polarAngleMod;
    }
    var proportion = polarAngleMod / (SECTOR_SIZE / 2);

    return proportion * PIXEL_REFRESH_RATE;
};

const ALL_REFRESH_ALGORITHMS = [RIPPLE_REFRESH_ALGORITHM, SECTOR_REFRESH_ALGORITHM, DIAMOND_REFRESH_ALGORITHM];

module.exports = ALL_REFRESH_ALGORITHMS[2];
