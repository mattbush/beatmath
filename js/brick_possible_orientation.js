var _ = require('underscore');

const POSSIBLE_ORIENTATIONS_BY_PARITY = [
    [0, 2, 4],
    [1, 3, 5],
];
const NEIGHBOR_OFFSETS_AND_POSSIBLE_ORIENTATIONS_BY_PARITY = [
    [
        {x: 2, y: 0, constraints: {1: [0], 3: [2, 4], 5: [2, 4]}},
        {x: -1, y: 1, constraints: {5: [4], 1: [0, 2], 3: [0, 2]}},
        {x: -1, y: -1, constraints: {3: [2], 1: [0, 4], 5: [0, 4]}},
        {x: 3, y: 1, constraints: {2: [2, 4]}},
        {x: 0, y: 2, constraints: {2: [0, 2]}},
        {x: -3, y: 1, constraints: {0: [0, 2]}},
        {x: -3, y: -1, constraints: {0: [0, 4]}},
        {x: 0, y: -2, constraints: {4: [0, 4]}},
        {x: 3, y: -1, constraints: {4: [2, 4]}},
    ],
    [
        {x: -2, y: 0, constraints: {0: [1], 2: [3, 5], 4: [3, 5]}},
        {x: 1, y: 1, constraints: {2: [3], 0: [1, 5], 4: [1, 5]}},
        {x: 1, y: -1, constraints: {4: [5], 0: [1, 3], 2: [1, 3]}},
        {x: 3, y: 1, constraints: {1: [1, 5]}},
        {x: 0, y: 2, constraints: {5: [1, 5]}},
        {x: -3, y: 1, constraints: {5: [3, 5]}},
        {x: -3, y: -1, constraints: {3: [3, 5]}},
        {x: 0, y: -2, constraints: {3: [1, 3]}},
        {x: 3, y: -1, constraints: {1: [1, 3]}},
    ],
];

var getPossibleOrientationsBasedOnNeighbors = function(grid, newItem) {
    var allPossibleOrientations = POSSIBLE_ORIENTATIONS_BY_PARITY[newItem.parity];
    var possibleOrientations = allPossibleOrientations;
    for (var neighborOffset of NEIGHBOR_OFFSETS_AND_POSSIBLE_ORIENTATIONS_BY_PARITY[newItem.parity]) {
        var neighborCoords = `${newItem.x + neighborOffset.x},${newItem.y + neighborOffset.y}`;
        if (_.has(grid, neighborCoords)) {
            var neighborOrientation = grid[neighborCoords];
            possibleOrientations = _.intersection(possibleOrientations, neighborOffset.constraints[neighborOrientation] || allPossibleOrientations);
        }
    }
    return possibleOrientations;
};

var getRandomOrientationFromArray = function(orientations) {
    var randomIndex = Math.floor(Math.random() * orientations.length);
    return orientations[randomIndex];
};

var getPossibleOrientation = function(grid, newItem) {
    var possibleOrientations = getPossibleOrientationsBasedOnNeighbors(grid, newItem);
    if (!_.isEmpty(possibleOrientations)) {
        return getRandomOrientationFromArray(possibleOrientations);
    }
    return null;
};

module.exports = getPossibleOrientation;
