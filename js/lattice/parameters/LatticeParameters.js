const {IntLinearParameter, ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackFaders, MixtrackKnobs, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class LatticeParameters extends PieceParameters {
    _declareParameters() {
        return {
            showInfluences: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 0,
                listenToMixtrackButton: MixtrackButtons.L_SYNC,
                monitorName: 'Debug Influences',
            },
            mixCoefficient: {
                type: LinearParameter,
                range: [0.2, 2],
                start: 1,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Distance Coeff',
            },
            numCols: {
                type: IntLinearParameter,
                range: [0, 40],
                start: 12,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                listenToMixtrackFader: MixtrackFaders.L_GAIN,
                monitorName: '# Columns',
            },
            numRows: {
                type: IntLinearParameter,
                range: [0, 25],
                start: 12,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                listenToMixtrackFader: MixtrackFaders.R_GAIN,
                monitorName: '# Rows',
            },
            oscillate: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 1,
                listenToMixtrackButton: MixtrackButtons.L_PITCH_BEND_MINUS,
                monitorName: 'Oscillate?',
            },
            triangularGridAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [0, 0],
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                monitorName: 'Triangle Grid %',
            },
        };
    }
}

module.exports = LatticeParameters;
