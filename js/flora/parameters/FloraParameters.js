const {ManualParameter, LogarithmicParameter, LambdaParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');
const {INFLUENCE_SCALE_FACTOR} = require('js/flora/parameters/FloraConstants');

const Y_AXIS_SCALE = Math.sqrt(3);

class FloraParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, opts) {
        super(mixboard, beatmathParameters, opts);

        this.influenceMinColumn = new LambdaParameter(this.numColumns, x => x * -1 * INFLUENCE_SCALE_FACTOR);
        this.influenceMaxColumn = new LambdaParameter(this.numColumns, x => x * INFLUENCE_SCALE_FACTOR);
        this.influenceMinRow = new LambdaParameter(this.numRows, () => Y_AXIS_SCALE * -3 * INFLUENCE_SCALE_FACTOR);
        this.influenceMaxRow = new LambdaParameter(this.numRows, x => Y_AXIS_SCALE * (-3.5 + x) * INFLUENCE_SCALE_FACTOR);
    }
    _declareParameters() {
        return {
            ...P.CustomToggle({name: 'showInfluences', button: 0}),
            mixCoefficient: {
                type: LogarithmicParameter,
                range: [1 / 3, 3],
                start: 0.9,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LogarithmicParameter,
                range: [1 / 3, 3],
                start: 1.2,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Distance Coeff',
            },
            ...P.NumColumns({start: 14, max: 14}),
            ...P.NumRows({start: 5, max: 7}),
            ...P.CustomToggle({name: 'oscillate', button: 1}),
            ...P.CustomToggle({name: 'showCenters', button: 2, start: true}),
            ...P.CustomToggle({name: 'showEdges', button: 3, start: false}),
            latency: {
                type: ManualParameter,
                start: 0,
                monitorName: 'Latency',
                manualMonitorCoords: {x: 5, y: 5},
            },
            ...P.CustomPercent({name: 'wavePercent', inputPosition: {fader: 5}}),
        };
    }
}

module.exports = FloraParameters;
