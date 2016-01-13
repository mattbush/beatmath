const ARRANGEMENTS = [
    {
        height: 5,
        width: 5,
        goldX: [0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 4, 4, 5, 5],
        goldY: [0, 1, 0, 1, 4, 5, 4, 5, 2, 3, 2, 3, 0, 1, 0, 1, 4, 5, 4, 5],
        blueX: [0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3, 4, 4, 5, 5],
        blueY: [2, 3, 2, 3, 0, 1, 0, 1, 4, 5, 4, 5, 2, 3, 2, 3],
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
