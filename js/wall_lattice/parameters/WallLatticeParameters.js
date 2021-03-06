// const _ = require('lodash');
const {Parameter, ManualParameter, MovingLinearParameter, LinearParameter, NegatedParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

class WallLatticeParameters extends PieceParameters {
    constructor(...args) {
        super(...args);

        this.influenceMinColumn = new NegatedParameter(this.numColumns);
        this.influenceMaxColumn = this.numColumns;
        this.influenceMinRow = new NegatedParameter(this.numRows);
        this.influenceMaxRow = this.numRows;
    }
    _declareParameters() {
        return {
            mixCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1.2,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1.0,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Distance Coeff',
            },
            numColumns: {
                type: Parameter,
                start: 38,
            },
            numRows: {
                type: Parameter,
                start: 12,
            },
            flipDurationPercent: {
                type: MovingLinearParameter,
                range: [0.05, 0.95],
                autoupdateRange: [0.15, 0.55],
                start: 0.3,
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                monitorName: 'Flip Duration %',
                variance: 0.01,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            ...P.CustomPercent({name: 'wavePercent', inputPosition: {fader: 5}}),
            latency: {
                type: ManualParameter,
                start: 0,
                monitorName: 'Latency',
                manualMonitorCoords: {x: 5, y: 5},
            },
        };
    }
}

module.exports = WallLatticeParameters;
