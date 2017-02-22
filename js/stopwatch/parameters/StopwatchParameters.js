const {IntLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class StopwatchParameters extends PieceParameters {
    _declareParameters() {
        return {
            numRings: {
                type: IntLinearParameter,
                range: [1, 4],
                start: 2,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: '# Rings',
            },
            numTrails: {
                type: IntLinearParameter,
                range: [2, 8],
                start: 2,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: '# Trails',
            },
            trailLength: {
                type: IntLinearParameter,
                range: [1, 32],
                start: 8,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'Trail Length',
            },
        };
    }
}

module.exports = StopwatchParameters;
