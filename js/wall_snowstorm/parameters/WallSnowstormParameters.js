const {MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class WallSnowstormParameters extends PieceParameters {
    _declareParameters() {
        return {
            test: {
                type: MovingLinearParameter,
                range: [0.1, 0.45],
                start: 0.2,
                listenToLaunchpadFader: 0,
                monitorName: 'Bleh',
            },
        };
    }
}

module.exports = WallSnowstormParameters;
