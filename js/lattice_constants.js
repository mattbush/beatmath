const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const BASE = 8;
const NUM_ROWS = 5 * BASE;
const NUM_COLS = 8 * BASE;

const CELL_SIZE = HEIGHT_PX / NUM_ROWS;

const INFLUENCE_REFRESH_RATE = 200;
const PIXEL_REFRESH_RATE = 1000;

const MIX_COEFFICIENT = 1.0;

const ENABLE_HUE = false;

module.exports = {
    WIDTH_PX,
    HEIGHT_PX,
    BASE,
    NUM_ROWS,
    NUM_COLS,
    CELL_SIZE,
    INFLUENCE_REFRESH_RATE,
    PIXEL_REFRESH_RATE,
    MIX_COEFFICIENT,
    ENABLE_HUE,
};
