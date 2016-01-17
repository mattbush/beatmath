var {posMod} = require('js/utils/math');

const NUM_GOLD = 20;
const NUM_BLUE = 16;

var generateIncrementFunction = function(total, increment) {
    return value => posMod(value + increment, total);
};

var incrementGoldUp = generateIncrementFunction(NUM_GOLD, 1);
var incrementGoldDown = generateIncrementFunction(NUM_GOLD, -1);
var incrementBlueUp = generateIncrementFunction(NUM_BLUE, 1);
var incrementBlueDown = generateIncrementFunction(NUM_BLUE, -1);

module.exports = {
    incrementGoldUp,
    incrementBlueUp,
    incrementGoldDown,
    incrementBlueDown,
};
