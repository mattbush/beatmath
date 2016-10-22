const {posMod} = require('js/core/utils/math');

const NUM_GOLD = 20;
const NUM_BLUE = 16;

const generateIncrementFunction = function(total, increment) {
    return value => posMod(value + increment, total);
};

const generateIncrementModFunction = function(divisor, increment) {
    return value => {
        const base = Math.floor(value / divisor) * divisor;
        const valueMod = value % divisor;
        return base + posMod(valueMod + increment, divisor);
    };
};

const generateIncrementFixedCenterGoldFunction = function(increment) {
    return value => {
        const base = Math.floor(value / 5) * 5;
        const valueMod = value % 5;
        if (valueMod === 0) {
            return value;
        } else {
            return base + 1 + posMod(valueMod - 1 + increment, 4);
        }
    };
};

const generateIncrementRotatingCenterGoldFunction = function(increment) {
    return value => {
        const multipleOf5 = Math.floor(value / 5);
        const base = multipleOf5 * 5;
        const valueMod = value % 5;
        if (valueMod === 0) {
            return 5 * posMod(multipleOf5 + increment, 4);
        } else {
            return base + 1 + posMod(valueMod - 1 + increment, 4);
        }
    };
};

const generateIncrementModTwoSectionsFunction = function(midpoint, total, increment) {
    const topHalfSize = total - midpoint;

    return value => {
        if (value >= midpoint) {
            value = value - midpoint;
            return midpoint + posMod(value + increment, topHalfSize);
        } else {
            return posMod(value + increment, midpoint);
        }
    };
};

module.exports = {
    incrementGoldUp: generateIncrementFunction(NUM_GOLD, 1),
    incrementGoldDown: generateIncrementFunction(NUM_GOLD, -1),
    incrementBlueUp: generateIncrementFunction(NUM_BLUE, 1),
    incrementBlueDown: generateIncrementFunction(NUM_BLUE, -1),

    incrementRotatingCenterGoldUp: generateIncrementRotatingCenterGoldFunction(1),
    incrementRotatingCenterGoldDown: generateIncrementRotatingCenterGoldFunction(-1),
    incrementFixedCenterGoldUp: generateIncrementFixedCenterGoldFunction(1),
    incrementFixedCenterGoldDown: generateIncrementFixedCenterGoldFunction(-1),
    incrementModQuarterGoldUp: generateIncrementModFunction(NUM_GOLD / 4, 1),
    incrementModQuarterGoldDown: generateIncrementModFunction(NUM_GOLD / 4, -1),
    incrementModQuarterBlueUp: generateIncrementModFunction(NUM_BLUE / 4, 1),
    incrementModQuarterBlueDown: generateIncrementModFunction(NUM_BLUE / 4, -1),

    incrementModHalfGoldUp: generateIncrementModFunction(NUM_GOLD / 2, 1),
    incrementModHalfGoldDown: generateIncrementModFunction(NUM_GOLD / 2, -1),
    incrementModHalfBlueUp: generateIncrementModFunction(NUM_BLUE / 2, 1),
    incrementModHalfBlueDown: generateIncrementModFunction(NUM_BLUE / 2, -1),
    incrementModNumeralsGoldUp: generateIncrementModTwoSectionsFunction(8, NUM_GOLD, 1),
    incrementModNumeralsGoldDown: generateIncrementModTwoSectionsFunction(8, NUM_GOLD, -1),
};
