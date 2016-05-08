const {MovingAngleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackWheels, MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/bricks/parameters/BricksConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class BricksParameters extends PieceParameters {
    _declareParameters() {
        return {
            motionAngle: {
                type: MovingAngleParameter,
                max: 1,
                variance: 0.1,
                start: 0,
                listenToMixtrackWheel: MixtrackWheels.BROWSE,
            },
            brickHomogeneity: {
                type: LinearParameter,
                range: [-5, 5],
                start: -0.4,
                listenToMixtrackFader: MixtrackKnobs.CUE_GAIN,
            },
        };
    }
}

module.exports = BricksParameters;
