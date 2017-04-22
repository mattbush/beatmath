const {ManualParameter, LinearParameter, NegatedParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

class TactileParameters extends PieceParameters {
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
                type: LinearParameter,
                range: [0.2, 2],
                start: 1,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 0],
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 1],
                monitorName: 'Distance Coeff',
            },
            ...P.NumColumns({start: 17, max: 32}),
            ...P.NumRows({start: 10, max: 32}),
            ...P.CustomToggle({name: 'oscillate', button: 1}),
            ...P.TriangularGridPercent({inputPosition: [0, 0]}),
            flipDurationPercent: {
                type: LinearParameter,
                range: [0.1, 0.9],
                start: 0.3,
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                monitorName: 'Flip Duration %',
            },
            ...P.CustomToggle({name: 'perpendicularFlip', button: 4}),
            ...P.CustomPercent({name: 'varySizePercent', inputPosition: [0, 4]}),
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

module.exports = TactileParameters;
