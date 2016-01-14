var {MovingAngleParameter} = require('js/parameters/Parameter');
var {mixboardWheel} = require('js/inputs/MixboardConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/parameters/bricks/BricksConstants');

class BricksParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;

        this.motionAngle = new MovingAngleParameter({
            max: 1,
            variance: 0.1,
            start: 0,
        });
        this.motionAngle.listenToWheel(mixboard, mixboardWheel.L_TURNTABLE);
    }
}

module.exports = BricksParameters;
