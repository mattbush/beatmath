const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SnowstormParameters extends PieceParameters {
    _declareParameters() {
        return {
            width1: {
                type: LinearParameter,
                range: [0.05, 0.5],
                start: 0.2,
                listenToLaunchpadKnob: [0, 0],
                monitorName: 'Width 1',
            },
            length1: {
                type: LinearParameter,
                range: [0.05, 1.5],
                start: 1,
                listenToLaunchpadKnob: [0, 1],
                monitorName: 'Length 1',
            },
        };
    }
}

module.exports = SnowstormParameters;
