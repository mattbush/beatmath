const {LinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
const {mixboardWheel, mixboardKnob, mixboardButton} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

const AUTOPILOT_FREQ_MAX = 6;

class FrondState extends PieceParameters {
    _declareParameters() {
        return {
            angle: {
                type: AngleParameter,
                start: AngleParameter.RANDOM_ANGLE,
                listenToWheel: mixboardWheel.R_TURNTABLE,
            },
            scaleLog2: {
                type: LinearParameter,
                range: [-3, 3],
                start: 0,
                listenToWheel: mixboardWheel.R_CONTROL_2,
            },
            numLeaves: {
                type: LinearParameter,
                range: [2, 32],
                start: 2,
                listenToWheel: mixboardWheel.R_SELECT,
            },
            autorotateAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToKnob: mixboardKnob.R_MID,
            },
            autorotatePeriodLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 3,
                listenToDecrementAndIncrementButtons: [mixboardButton.R_LOOP_MANUAL, mixboardButton.R_LOOP_IN],
            },
            autoscaleAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToKnob: mixboardKnob.R_BASS,
            },
            autoscalePeriodLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 3,
                listenToDecrementAndIncrementButtons: [mixboardButton.R_LOOP_OUT, mixboardButton.R_LOOP_RELOOP],
            },

        };
    }
    constructor(mixboard, beatmathParameters, frondsParameters) {
        super(mixboard, beatmathParameters);
        this._frondsParameters = frondsParameters;
    }
}

module.exports = FrondState;
