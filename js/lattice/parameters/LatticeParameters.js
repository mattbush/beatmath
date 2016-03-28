var {ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardButton, mixboardFader, mixboardKnob, mixboardWheel} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class LatticeParameters extends PieceParameters {
    _declareParameters() {
        return {
            showInfluences: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.L_SYNC,
            },
            mixCoefficient: {
                type: LinearParameter,
                range: [0.2, 2],
                start: 1,
                listenToKnob: mixboardKnob.L_BASS,
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1,
                listenToKnob: mixboardKnob.R_BASS,
            },
            numCols: {
                type: LinearParameter,
                range: [0, 40],
                start: 12,
                listenToFader: mixboardFader.L_GAIN,
            },
            numRows: {
                type: LinearParameter,
                range: [0, 25],
                start: 12,
                listenToFader: mixboardFader.R_GAIN,
            },
            oscillate: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.L_PITCH_BEND_MINUS,
            },
            polarGridAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                listenToWheel: mixboardWheel.R_CONTROL_2,
            },
        };
    }
}

module.exports = LatticeParameters;
