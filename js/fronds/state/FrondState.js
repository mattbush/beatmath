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
                constrainTo: false,
                listenToWheel: mixboardWheel.R_TURNTABLE,
            },
            scaleLog2: {
                type: LinearParameter,
                range: [-3, 3],
                start: 0,
                incrementAmount: 0.25,
                listenToWheel: mixboardWheel.R_CONTROL_2,
            },
            autorotateAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5,
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
                start: 0.5,
                listenToKnob: mixboardKnob.R_BASS,
            },
            autoscalePeriodLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 2,
                listenToDecrementAndIncrementButtons: [mixboardButton.R_LOOP_OUT, mixboardButton.R_LOOP_RELOOP],
            },
            numLeaves: {
                type: LinearParameter,
                range: [2, 32],
                start: 2,
                listenToWheel: mixboardWheel.R_SELECT,
            },
            leafLengthLog2: {
                type: LinearParameter,
                range: [-3, 3],
                start: 0,
                incrementAmount: 0.25,
                listenToWheel: mixboardWheel.R_CONTROL_1,
                monitorName: 'Leaf Length Log2',
            },
            leafTapering: {
                type: LinearParameter,
                range: [0, 1],
                start: 1,
                incrementAmount: 0.1,
                listenToDecrementAndIncrementButtons: [mixboardButton.R_DELETE, mixboardButton.R_HOT_CUE_1],
                monitorName: 'Leaf Tapering',
            },
        };
    }
    constructor(mixboard, beatmathParameters, frondsParameters) {
        super(mixboard, beatmathParameters);
        this._frondsParameters = frondsParameters;

        this._onTickForAutopilot = this._onTickForAutopilot.bind(this);
        this._beatmathParameters.tempo.addListener(this._onTickForAutopilot);
    }
    getScaleTransitionTime() {
        return Math.pow(2, this.autoscalePeriodLog2.getValue()) * this._beatmathParameters.tempo.getPeriod();
    }
    getAngleTransitionTime() {
        return Math.pow(2, this.autorotatePeriodLog2.getValue()) * this._beatmathParameters.tempo.getPeriod();
    }
    _onTickForAutopilot() {
        var ticks = this._beatmathParameters.tempo.getNumTicks();

        const autoscaleFreq = Math.pow(2, this.autoscalePeriodLog2.getValue());
        const autorotateFreq = Math.pow(2, this.autorotatePeriodLog2.getValue());

        if (ticks % autoscaleFreq === 0) {
            const polarity = (ticks % (autoscaleFreq * 2) === 0) ? 1 : -1;
            const scaleLog2Amount = polarity * this.autoscaleAmount.getValue();
            this.scaleLog2._constrainToRangeAndUpdateValue(this.scaleLog2.getValue() + scaleLog2Amount); // HACK
        }
        if (ticks % autorotateFreq === 0) {
            const polarity = (ticks % (autorotateFreq * 2) === 0) ? 1 : -1;
            const rotateAmount = polarity * this.autorotateAmount.getValue() * 360;
            this.angle._spinValue(rotateAmount);
        }
    }
}

module.exports = FrondState;
