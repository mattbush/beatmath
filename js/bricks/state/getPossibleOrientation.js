const _ = require('lodash');
const {nextFloat} = require('js/core/utils/math');

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

const truncateToBaseOrientation = function(orientation) {
    return orientation % 2 ? orientation - 1 : orientation;
};

const getPossibleOrientationsBasedOnNeighbors = function(bricksParameters, grid, newItem) {
    const allPossibleOrientations = POSSIBLE_ORIENTATIONS_BY_PARITY[newItem.parity];
    const neighborOrientationsSeen = {0: 0, 2: 0, 4: 0};
    let possibleOrientations = allPossibleOrientations;
    for (let neighborOffset of NEIGHBOR_OFFSETS_AND_POSSIBLE_ORIENTATIONS_BY_PARITY[newItem.parity]) {
        const neighborCoords = `${newItem.x + neighborOffset.x},${newItem.y + neighborOffset.y}`;
        if (_.has(grid, neighborCoords)) {
            const neighborOrientation = grid[neighborCoords];
            neighborOrientationsSeen[truncateToBaseOrientation(neighborOrientation)]++;
            possibleOrientations = _.intersection(possibleOrientations, neighborOffset.constraints[neighborOrientation] || allPossibleOrientations);
        }
    }
    if (!possibleOrientations.length) {
        return {};
    }
    const weightedPossibleOrientations = {};
    const brickHomogeneity = bricksParameters.brickHomogeneity.getValue();
    const multiple = Math.abs(brickHomogeneity);
    const sign = Math.sign(brickHomogeneity);
    for (let possibleOrientation of possibleOrientations) {
        const neighborCount = neighborOrientationsSeen[possibleOrientation - newItem.parity];
        weightedPossibleOrientations[possibleOrientation] = Math.pow((1 + neighborCount * multiple), sign);
    }
    return weightedPossibleOrientations;
};

const addPair = function(a, b) { return a + b; };

const getRandomOrientationFromArray = function(weightedPossibleOrientations) {
    const sum = _.values(weightedPossibleOrientations).reduce(addPair, 0);
    let randomVal = nextFloat(sum);
    for (let orientation in weightedPossibleOrientations) { // eslint-disable-line guard-for-in
        const weight = weightedPossibleOrientations[orientation];
        if (randomVal < weight) {
            return orientation;
        } else {
            randomVal -= weight;
        }
    }
    throw new Error('this should be unreachable');
};

const getPossibleOrientation = function(bricksParameters, grid, newItem) {
    const weightedPossibleOrientations = getPossibleOrientationsBasedOnNeighbors(bricksParameters, grid, newItem);
    if (!_.isEmpty(weightedPossibleOrientations)) {
        return getRandomOrientationFromArray(weightedPossibleOrientations);
    }
    return null;
};

module.exports = getPossibleOrientation;
