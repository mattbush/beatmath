var {MovingAngleParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardWheel, mixboardKnob} = require('js/core/inputs/MixboardConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/bricks/parameters/BricksConstants');

class BricksParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;

        this.motionAngle = new MovingAngleParameter({
            max: 1,
            variance: 0.1,
            start: 0,
        });
        this.motionAngle.listenToWheel(mixboard, mixboardWheel.BROWSE);

        this.brickHomogeneity = new LinearParameter({
            min: -5,
            max: 5,
            start: -0.4,
        });
        this.brickHomogeneity.listenToFader(mixboard, mixboardKnob.CUE_GAIN);
    }
}

module.exports = BricksParameters;
