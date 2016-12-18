const {MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SnowstormParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, which) {
        super(mixboard, beatmathParameters, {
            knobColumnOffset: which * 3,
            monitorNamePrefix: which ? 'R ' : 'L ',
        });
    }
    _declareParameters({knobColumnOffset, monitorNamePrefix}) {
        return {
            width1: {
                type: MovingLinearParameter,
                range: [0.1, 0.45],
                start: 0.2,
                listenToLaunchpadKnob: [0, 0 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Width 1',
                variance: 0.01,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            length1: {
                type: MovingLinearParameter,
                range: [0.3, 1.5],
                start: 1,
                listenToLaunchpadKnob: [0, 1 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Length 1',
                variance: 0.03,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            width2: {
                type: MovingLinearParameter,
                range: [0.1, 0.45],
                start: 0.2,
                listenToLaunchpadKnob: [1, 0 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Width 2',
                variance: 0.01,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            length2: {
                type: MovingLinearParameter,
                range: [0.3, 1.5],
                start: 0.6,
                listenToLaunchpadKnob: [1, 1 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Length 2',
                variance: 0.03,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            offset2: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToLaunchpadKnob: [2, 1 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Offset 2',
                variance: 0.02,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
        };
    }
}

module.exports = SnowstormParameters;
