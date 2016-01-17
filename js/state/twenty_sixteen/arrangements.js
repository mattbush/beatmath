var {
    incrementGoldUp,
    incrementGoldDown,
    incrementRotatingCenterGoldUp,
    incrementRotatingCenterGoldDown,
    incrementFixedCenterGoldUp,
    incrementFixedCenterGoldDown,
    incrementModQuarterGoldUp,
    incrementModQuarterGoldDown,
    incrementModQuarterBlueUp,
    incrementModQuarterBlueDown,
    incrementModHalfGoldUp,
    incrementModHalfGoldDown,
    incrementModHalfBlueUp,
    incrementModHalfBlueDown,
    incrementModNumeralsGoldUp,
    incrementModNumeralsGoldDown,
} = require('js/state/twenty_sixteen/IndexMappingFunctions');

const ARRANGEMENTS = [
    { // large X with 2x2 pixels
        height: 5,
        width: 5,
        goldX: [2, 1, 0, 0, 1, 3, 4, 4, 5, 5, 3, 4, 5, 5, 4, 2, 1, 1, 0, 0],
        goldY: [2, 1, 1, 0, 0, 2, 1, 0, 0, 1, 3, 4, 4, 5, 5, 3, 4, 5, 5, 4],
        blueX: [2, 2, 3, 3, 4, 5, 5, 4, 3, 3, 2, 2, 1, 0, 0, 1],
        blueY: [1, 0, 0, 1, 2, 2, 3, 3, 4, 5, 5, 4, 3, 3, 2, 2],
        shiftGoldUp: incrementRotatingCenterGoldUp,
        shiftGoldDown: incrementRotatingCenterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 2x2 X'es
        height: 5,
        width: 5,
        goldX: [1, 2, 0, 0, 2, 4, 3, 3, 5, 5, 4, 3, 5, 5, 3, 1, 2, 2, 0, 0],
        goldY: [1, 2, 2, 0, 0, 1, 2, 0, 0, 2, 4, 3, 3, 5, 5, 4, 3, 5, 5, 3],
        blueX: [1, 0, 1, 2, 3, 4, 5, 4, 4, 5, 4, 3, 2, 1, 0, 1],
        blueY: [2, 1, 0, 1, 1, 0, 1, 2, 3, 4, 5, 4, 4, 5, 4, 3],
        shiftGoldUp: incrementFixedCenterGoldUp,
        shiftGoldDown: incrementFixedCenterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // large + with 2x2 pixels
        height: 5,
        width: 5,
        goldX: [2, 2, 2, 3, 3, 3, 4, 5, 5, 4, 3, 3, 3, 2, 2, 2, 1, 0, 0, 1],
        goldY: [2, 1, 0, 0, 1, 2, 2, 2, 3, 3, 3, 4, 5, 5, 4, 3, 3, 3, 2, 2],
        blueX: [1, 0, 0, 1, 4, 4, 5, 5, 4, 5, 5, 4, 1, 1, 0, 0],
        blueY: [1, 1, 0, 0, 1, 0, 0, 1, 4, 4, 5, 5, 4, 5, 5, 4],
        shiftGoldUp: incrementRotatingCenterGoldUp,
        shiftGoldDown: incrementRotatingCenterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 2x2 +'s
        height: 5,
        width: 5,
        goldX: [1, 1, 0, 1, 2, 4, 3, 4, 5, 4, 4, 4, 5, 4, 3, 1, 2, 1, 0, 1],
        goldY: [1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 4, 3, 4, 5, 4, 4, 4, 5, 4, 3],
        blueX: [2, 0, 0, 2, 3, 3, 5, 5, 3, 5, 5, 3, 2, 2, 0, 0],
        blueY: [2, 2, 0, 0, 2, 0, 0, 2, 3, 3, 5, 5, 3, 5, 5, 3],
        shiftGoldUp: incrementFixedCenterGoldUp,
        shiftGoldDown: incrementFixedCenterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 6x6 blue core with gold crust
        height: 5,
        width: 5,
        goldX: [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
        goldY: [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1],
        blueX: [2, 1, 1, 2, 3, 3, 4, 4, 3, 4, 4, 3, 2, 2, 1, 1],
        blueY: [2, 2, 1, 1, 2, 1, 1, 2, 3, 3, 4, 4, 3, 4, 4, 3],
        shiftGoldUp: incrementGoldUp,
        shiftGoldDown: incrementGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 7x7 gold diamond with blue encrusting
        height: 6,
        width: 6,
        goldX: [2, 2, 3, 3, 4, 4, 5, 5, 6, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 1],
        goldY: [2, 1, 1, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 5, 4, 4, 3, 3, 2],
        blueX: [1, 0, 0, 1, 5, 5, 6, 6, 5, 6, 6, 5, 1, 1, 0, 0],
        blueY: [1, 1, 0, 0, 1, 0, 0, 1, 5, 5, 6, 6, 5, 6, 6, 5],
        shiftGoldUp: incrementGoldUp,
        shiftGoldDown: incrementGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 7x7 gold Ts holding together blue squares
        height: 6,
        width: 6,
        goldX: [3, 3, 2, 3, 4, 4, 5, 6, 6, 6, 3, 3, 4, 3, 2, 2, 1, 0, 0, 0],
        goldY: [2, 1, 0, 0, 0, 3, 3, 2, 3, 4, 4, 5, 6, 6, 6, 3, 3, 4, 3, 2],
        blueX: [2, 1, 1, 2, 4, 4, 5, 5, 4, 5, 5, 4, 2, 2, 1, 1],
        blueY: [2, 2, 1, 1, 2, 1, 1, 2, 4, 4, 5, 5, 4, 5, 5, 4],
        shiftGoldUp: incrementModQuarterGoldUp,
        shiftGoldDown: incrementModQuarterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // 7x7 blue Ts holding together gold squares
        height: 6,
        width: 6,
        goldX: [2, 1, 0, 0, 1, 4, 5, 5, 6, 6, 4, 5, 6, 6, 5, 2, 1, 1, 0, 0],
        goldY: [2, 1, 1, 0, 0, 2, 1, 0, 0, 1, 4, 5, 5, 6, 6, 4, 5, 6, 6, 5],
        blueX: [3, 2, 3, 4, 5, 6, 6, 6, 3, 4, 3, 2, 1, 0, 0, 0],
        blueY: [1, 0, 0, 0, 3, 2, 3, 4, 5, 6, 6, 6, 3, 4, 3, 2],
        shiftGoldUp: incrementFixedCenterGoldUp,
        shiftGoldDown: incrementFixedCenterGoldDown,
        shiftBlueUp: incrementModQuarterBlueUp,
        shiftBlueDown: incrementModQuarterBlueDown,
    },
    { // vertical stripes, 4x9
        height: 3,
        width: 8,
        goldX: [4, 2, 0, 0, 2, 4, 6, 8, 8, 6, 4, 6, 8, 8, 6, 4, 2, 0, 0, 2],
        goldY: [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2],
        blueX: [1, 1, 3, 3, 5, 5, 7, 7, 7, 7, 5, 5, 3, 3, 1, 1],
        blueY: [1, 0, 0, 1, 1, 0, 0, 1, 2, 3, 3, 2, 2, 3, 3, 2],
        shiftGoldUp: incrementModHalfGoldUp,
        shiftGoldDown: incrementModHalfGoldDown,
        shiftBlueUp: incrementModHalfBlueUp,
        shiftBlueDown: incrementModHalfBlueDown,
    },
    { // 2016, 5x15
        height: 4,
        width: 14,
        goldX: [0, 1, 2, 1, 0, 0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 5, 4, 4, 4, 4],
        goldY: [0, 0, 1, 2, 3, 4, 4, 4, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 2, 1],
        blueX: [8, 9, 9, 9, 9, 8, 9, 10, 14, 13, 12, 12, 12, 13, 14, 13],
        blueY: [1, 0, 1, 2, 3, 4, 4, 4, 0, 0, 1, 2, 3, 4, 3, 2],
        shiftGoldUp: incrementModNumeralsGoldUp,
        shiftGoldDown: incrementModNumeralsGoldDown,
        shiftBlueUp: incrementModHalfBlueUp,
        shiftBlueDown: incrementModHalfBlueDown,
    },
];

module.exports = ARRANGEMENTS;
