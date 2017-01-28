const {MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class WallSnowstormParameters extends PieceParameters {
    _declareParameters() {
        return {
            columnDelayLimit: {
                type: MovingLinearParameter,
                range: [400, 2000],
                start: 1500,
                listenToLaunchpadFader: 3,
                monitorName: 'Column delay limit',
            },
            delayPerColumn: {
                type: MovingLinearParameter,
                range: [-100, 100],
                start: 80,
                listenToLaunchpadFader: 2,
                monitorName: 'Delay per column',
            },
            delayPerRow: {
                type: MovingLinearParameter,
                range: [0, 600],
                start: 400,
                listenToLaunchpadFader: 1,
                monitorName: 'Delay per row',
            },
            transitionTime: {
                type: MovingLinearParameter,
                range: [0, 1200],
                start: 800,
                listenToLaunchpadFader: 0,
                monitorName: 'Transition time',
            },
        };
    }
}

module.exports = WallSnowstormParameters;
