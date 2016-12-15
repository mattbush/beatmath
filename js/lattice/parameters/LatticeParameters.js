const {ManualParameter, ToggleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

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
            0: P.NumColumns({start: 12, max: 24}),
            1: P.NumRows({start: 12, max: 15}),
            oscillate: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 1,
                listenToMixtrackButton: MixtrackButtons.L_PITCH_BEND_MINUS,
                monitorName: 'Oscillate?',
            },
            2: P.TriangularGridPercent({knobPosition: [0, 0]}),
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

module.exports = LatticeParameters;
