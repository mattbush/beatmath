const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SnowstormParameters extends PieceParameters {
    _declareParameters() {
        return {
            width1: {
                type: LinearParameter,
                range: [0.1, 0.5],
                start: 0.2,
                listenToLaunchpadKnob: [0, 0],
                monitorName: 'Width 1',
            },
            length1: {
                type: LinearParameter,
                range: [0.3, 1.5],
                start: 1,
                listenToLaunchpadKnob: [0, 1],
                monitorName: 'Length 1',
            },
            width2: {
                type: LinearParameter,
                range: [0.1, 0.5],
                start: 0.2,
                listenToLaunchpadKnob: [1, 0],
                monitorName: 'Width 2',
            },
            length2: {
                type: LinearParameter,
                range: [0.3, 1.5],
                start: 0.6,
                listenToLaunchpadKnob: [1, 1],
                monitorName: 'Length 2',
            },
            offset2: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToLaunchpadKnob: [1, 2],
                monitorName: 'Offset 2',
            },
        };
    }
}

module.exports = SnowstormParameters;
