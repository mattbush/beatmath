const WIDTH_PX = 1280;
const HEIGHT_PX = 800;

const BASE = 8;
const NUM_ROWS = 5 * BASE;
const NUM_COLS = 8 * BASE;

const CELL_SIZE = HEIGHT_PX / NUM_ROWS;

const MIXER_REFRESH_RATE = 200;

const MIX_COEFFICIENT = 1.2;

module.exports = {
    WIDTH_PX,
    HEIGHT_PX,
    BASE,
    NUM_ROWS,
    NUM_COLS,
    CELL_SIZE,
    MIXER_REFRESH_RATE,
    MIX_COEFFICIENT,
};
