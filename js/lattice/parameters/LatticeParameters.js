const {IntLinearParameter, ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackFaders, MixtrackKnobs, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class LatticeParameters extends PieceParameters {
    _declareParameters() {
        return {
            showInfluences: {
                type: ToggleParameter,
                start: false,
                listenToMixtrackButton: MixtrackButtons.L_SYNC,
            },
            mixCoefficient: {
                type: LinearParameter,
                range: [0.2, 2],
                start: 1,
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1,
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
            },
            numCols: {
                type: IntLinearParameter,
                range: [0, 40],
                start: 12,
                listenToMixtrackFader: MixtrackFaders.L_GAIN,
            },
            numRows: {
                type: IntLinearParameter,
                range: [0, 25],
                start: 12,
                listenToMixtrackFader: MixtrackFaders.R_GAIN,
            },
            oscillate: {
                type: ToggleParameter,
                start: false,
                listenToMixtrackButton: MixtrackButtons.L_PITCH_BEND_MINUS,
            },
            triangularGridAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
            },
        };
    }
}

module.exports = LatticeParameters;
