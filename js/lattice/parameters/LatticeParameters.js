const {ManualParameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

class LatticeParameters extends PieceParameters {
    _declareParameters() {
        return {
            3: P.CustomToggle({name: 'showInfluences', button: 0}),
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
            4: P.CustomToggle({name: 'oscillate', button: 1}),
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
