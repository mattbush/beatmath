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
        if (ticks % Math.pow(2, autorotateFreq) === 0) {
            const polarity = (ticks % (autorotateFreq * 2) === 0) ? 1 : -1;
            const rotateAmount = polarity * this.autorotateAmount.getValue() * 360;
            this.angle._spinValue(rotateAmount);
        }
    }
}

module.exports = FrondState;
