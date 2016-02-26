const {WIDTH_PX, HEIGHT_PX} = require('js/core/parameters/BeatmathConstants.js');

const CELL_SIZE = 20;

// const BPM_CONST = 120;

const ANIMATION_TIME_COEFFICIENT = 1.0;

const MAX_SIZE = CELL_SIZE * 1.0;

const INFLUENCE_REFRESH_RATE = 200 * ANIMATION_TIME_COEFFICIENT;
const PIXEL_REFRESH_RATE = 1000 * ANIMATION_TIME_COEFFICIENT;

const ENABLE_HUE = false;

module.exports = {
    WIDTH_PX,
    HEIGHT_PX,
    CELL_SIZE,
    INFLUENCE_REFRESH_RATE,
    PIXEL_REFRESH_RATE,
    ENABLE_HUE,
    MAX_SIZE,
};
