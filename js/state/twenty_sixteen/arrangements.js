const ARRANGEMENTS = [
    { // large X with 2x2 pixels
        height: 5,
        width: 5,
        goldX: [2, 1, 0, 0, 1, 3, 4, 4, 5, 5, 3, 4, 5, 5, 4, 2, 1, 1, 0, 0],
        goldY: [2, 1, 1, 0, 0, 2, 1, 0, 0, 1, 3, 4, 4, 5, 5, 3, 4, 5, 5, 4],
        blueX: [2, 2, 3, 3, 4, 5, 5, 4, 3, 3, 2, 2, 1, 0, 0, 1],
        blueY: [1, 0, 0, 1, 2, 2, 3, 3, 4, 5, 5, 4, 3, 3, 2, 2],
    },
    { // 2x2 X'es
        height: 5,
        width: 5,
        goldX: [1, 2, 0, 0, 2, 4, 3, 3, 5, 5, 4, 3, 5, 5, 3, 1, 2, 2, 0, 0],
        goldY: [1, 2, 2, 0, 0, 1, 2, 0, 0, 2, 4, 3, 3, 5, 5, 4, 3, 5, 5, 3],
        blueX: [1, 0, 1, 2, 3, 4, 5, 4, 4, 5, 4, 3, 2, 1, 0, 1],
        blueY: [2, 1, 0, 1, 1, 0, 1, 2, 3, 4, 5, 4, 4, 5, 4, 3],
    },
    { // large + with 2x2 pixels
        height: 5,
        width: 5,
        goldX: [2, 2, 2, 3, 3, 3, 4, 5, 5, 4, 3, 3, 3, 2, 2, 2, 1, 0, 0, 1],
        goldY: [2, 1, 0, 0, 1, 2, 2, 2, 3, 3, 3, 4, 5, 5, 4, 3, 3, 3, 2, 2],
        blueX: [1, 0, 0, 1, 4, 4, 5, 5, 4, 5, 5, 4, 1, 1, 0, 0],
        blueY: [1, 1, 0, 0, 1, 0, 0, 1, 4, 4, 5, 5, 4, 5, 5, 4],
    },
    { // 2x2 +'s
        height: 5,
        width: 5,
        goldX: [1, 1, 0, 1, 2, 4, 3, 4, 5, 4, 4, 4, 5, 4, 3, 1, 2, 1, 0, 1],
        goldY: [1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 4, 3, 4, 5, 4, 4, 4, 5, 4, 3],
        blueX: [2, 0, 0, 2, 3, 3, 5, 5, 3, 5, 5, 3, 2, 2, 0, 0],
        blueY: [2, 2, 0, 0, 2, 0, 0, 2, 3, 3, 5, 5, 3, 5, 5, 3],
    },
    {
        height: 4,
        width: 14,
        goldX: [0, 1, 2, 1, 0, 0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 5, 4, 4, 4, 4],
        goldY: [0, 0, 1, 2, 3, 4, 4, 4, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 2, 1],
        blueX: [8, 9, 9, 9, 9, 8, 9, 10, 14, 13, 12, 12, 12, 13, 14, 13],
        blueY: [1, 0, 1, 2, 3, 4, 4, 4, 0, 0, 1, 2, 3, 4, 3, 2],
    },
];

module.exports = ARRANGEMENTS;
