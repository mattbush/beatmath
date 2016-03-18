var {MovingAngleParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardWheel, mixboardKnob} = require('js/core/inputs/MixboardConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/bricks/parameters/BricksConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class BricksParameters extends PieceParameters {
    constructor() {
        super(...arguments);

        this.motionAngle = new MovingAngleParameter({
            max: 1,
            variance: 0.1,
            start: 0,
        });
        this.motionAngle.listenToWheel(this._mixboard, mixboardWheel.BROWSE);

        this.brickHomogeneity = new LinearParameter({
            range: [-5, 5],
            start: -0.4,
        });
        this.brickHomogeneity.listenToFader(this._mixboard, mixboardKnob.CUE_GAIN);
    }
}

module.exports = BricksParameters;
