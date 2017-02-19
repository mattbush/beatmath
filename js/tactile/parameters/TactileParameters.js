const {ManualParameter, IntLinearParameter, ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackFaders, MixtrackKnobs, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class TactileParameters extends PieceParameters {
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
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Distance Coeff',
            },
            numColumns: {
                type: IntLinearParameter,
                range: [0, 32],
                start: 17,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                listenToMixtrackFader: MixtrackFaders.L_GAIN,
                monitorName: '# Columns',
            },
            numRows: {
                type: IntLinearParameter,
                range: [0, 32],
                start: 10,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
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
            triangularGridPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [0, 0],
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                monitorName: 'Triangle Grid %',
            },
            flipDurationPercent: {
                type: LinearParameter,
                range: [0.1, 0.9],
                start: 0.3,
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [0, 1],
                monitorName: 'Flip Duration %',
            },
            perpendicularFlip: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 2,
                monitorName: 'Perpendicular Flip?',
            },
            varySizePercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToLaunchpadKnob: [0, 2],
                monitorName: 'Vary Size %',
            },
            latency: {
                type: ManualParameter,
                start: 0,
                monitorName: 'Latency',
                manualMonitorCoords: {x: 5, y: 5},
            },
            wavePercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToLaunchpadFader: [5, {addButtonStatusLight: true}],
                monitorName: 'Wave %',
            },
        };
    }
}

module.exports = TactileParameters;
