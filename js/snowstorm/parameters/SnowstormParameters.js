const {MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

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
            rotation: {
                type: MovingLinearParameter,
                range: [-90, 90],
                start: 0,
                listenToLaunchpadKnob: [0, 2 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Rotation',
                variance: 5,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            windX: {
                type: MovingLinearParameter,
                range: [-200, 200],
                start: 0,
                listenToLaunchpadKnob: [1, 2 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Wind X',
                variance: 15,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            windY: {
                type: MovingLinearParameter,
                range: [-20, 140],
                start: 0,
                listenToLaunchpadKnob: [2, 2 + knobColumnOffset],
                monitorName: monitorNamePrefix + 'Wind Y',
                variance: 10,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            ...P.BaseColor(),
        };
    }
}

module.exports = SnowstormParameters;
