const {MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class WallSnowstormParameters extends PieceParameters {
    _declareParameters() {
        return {
            delayPerColumn: {
                type: MovingLinearParameter,
                range: [-100, 100],
                start: 80,
                listenToLaunchpadFader: 0,
                monitorName: 'Bleh',
            },
            delayPerRow: {
                type: MovingLinearParameter,
                range: [0, 600],
                start: 400,
                listenToLaunchpadFader: 0,
                monitorName: 'Bleh',
            },
            transitionTime: {
                type: MovingLinearParameter,
                range: [0, 1200],
                start: 800,
                listenToLaunchpadFader: 0,
                monitorName: 'Bleh',
            },
        };
    }
}

module.exports = WallSnowstormParameters;
