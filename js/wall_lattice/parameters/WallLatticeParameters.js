const {Parameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class WallLatticeParameters extends PieceParameters {
    _declareParameters() {
        return {
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
                type: Parameter,
                start: 38,
            },
            numRows: {
                type: Parameter,
                start: 8,
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

module.exports = WallLatticeParameters;
