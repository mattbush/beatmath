const {ManualParameter, LogarithmicParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

class LatticeParameters extends PieceParameters {
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
            ...P.NumColumns({start: 16, max: 24}),
            ...P.NumRows({start: 10, max: 15}),
            ...P.CustomToggle({name: 'oscillate', button: 1}),
            ...P.TriangularGridPercent({inputPosition: [0, 0], start: 1}), // TODO
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

module.exports = LatticeParameters;
