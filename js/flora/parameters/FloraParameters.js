const {ManualParameter, LogarithmicParameter, NegatedParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

class FloraParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, opts) {
        super(mixboard, beatmathParameters, opts);

        this.influenceMinColumn = new NegatedParameter(this.numColumns);
        this.influenceMaxColumn = this.numColumns;
        this.influenceMinRow = new NegatedParameter(this.numRows);
        this.influenceMaxRow = this.numRows;
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
                start: 0.6,
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
