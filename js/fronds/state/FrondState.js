const {MovingLinearParameter, MovingColorParameter, AngleParameter} = require('js/core/parameters/Parameter');
const {MixtrackWheels, MixtrackKnobs, MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const tinycolor = require('tinycolor2');

const AUTOPILOT_FREQ_MAX = 6;

class FrondState extends PieceParameters {
    _declareParameters() {
        return {
            color: {
                type: MovingColorParameter,
                max: 5,
                variance: 1,
                start: tinycolor('#2d2'),
                autoupdate: 1000,
            },
            x: {
                type: MovingLinearParameter,
                range: [-640, 640],
                start: 0,
                variance: 1.5,
                autoupdate: 250,
            },
            y: {
                type: MovingLinearParameter,
                range: [-400, 400],
                start: 0,
                variance: 1.5,
                autoupdate: 250,
            },
            angle: {
                type: AngleParameter,
                start: AngleParameter.RANDOM_ANGLE,
                constrainTo: false,
                listenToMixtrackWheel: MixtrackWheels.R_TURNTABLE,
            },
            scaleLog2: {
                type: MovingLinearParameter,
                range: [-4, 5],
                start: 0,
                incrementAmount: 0.25,
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                variance: 0.1,
                autoupdateEveryNBeats: 2,
            },
            autorotateAmount: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToMixtrackKnob: MixtrackKnobs.R_MID,
                variance: 0.01,
                autoupdateEveryNBeats: 4,
            },
            autorotatePeriodLog2: {
                type: MovingLinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.R_LOOP_MANUAL, MixtrackButtons.R_LOOP_IN],
                variance: 0.1,
                autoupdateEveryNBeats: 16,
            },
            autoscaleAmount: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                variance: 0.01,
                autoupdateEveryNBeats: 4,
            },
            autoscalePeriodLog2: {
                type: MovingLinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 2,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.R_LOOP_OUT, MixtrackButtons.R_LOOP_RELOOP],
                variance: 0.1,
                autoupdateEveryNBeats: 16,
            },
            numLeaves: {
                type: MovingLinearParameter,
                range: [2, 32],
                start: 2,
                listenToMixtrackWheel: MixtrackWheels.R_SELECT,
                variance: 1.5,
                autoupdateEveryNBeats: 8,
            },
            leafLengthLog2: {
                type: MovingLinearParameter,
                range: [-4, 5],
                start: 0,
                incrementAmount: 0.25,
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_1,
                monitorName: 'Leaf Length Log2',
                variance: 0.1,
                autoupdateEveryNBeats: 2,
            },
            leafTapering: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 1,
                incrementAmount: 0.1,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.R_DELETE, MixtrackButtons.R_HOT_CUE_1],
                monitorName: 'Leaf Tapering',
                variance: 0.01,
                autoupdateEveryNBeats: 2,
            },
            leafPointLength: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToMixtrackKnob: MixtrackKnobs.R_TREBLE,
                monitorName: 'Leaf Point Length',
                variance: 0.01,
                autoupdateEveryNBeats: 2,
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
        const ticks = this._beatmathParameters.tempo.getNumTicks();

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
