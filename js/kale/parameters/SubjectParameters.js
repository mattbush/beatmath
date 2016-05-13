const {MovingAngleParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SubjectParameters extends PieceParameters {
    _declareParameters() {
        return {
            outerRotation: {
                type: MovingAngleParameter,
                max: 45,
                variance: 5,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
                listenToLaunchpadKnob: [0, 4],
                monitorName: 'Outer Rotation',
                autoupdateOnCue: true,
            },
            innerRotation: {
                type: MovingAngleParameter,
                max: 45,
                variance: 5,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
                listenToLaunchpadKnob: [0, 5],
                monitorName: 'Inner Rotation',
                autoupdateOnCue: true,
            },
            outerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [-1.8, 1.2],
                start: -1.5,
                variance: 0.15,
                autoupdateEveryNBeats: 1,
            },
            innerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [0.5, 1.3],
                start: 0.9,
                variance: 0.15,
                autoupdateEveryNBeats: 1,
            },
            driftX: {
                type: MovingLinearParameter,
                range: [-2, 2],
                start: 0,
                variance: 0.2,
                autoupdateEveryNBeats: 1,
            },
            driftY: {
                type: MovingLinearParameter,
                range: [-2, 2],
                start: 0,
                variance: 0.2,
                autoupdateEveryNBeats: 1,
            },
            skewX: {
                type: MovingLinearParameter,
                range: [-10, 10],
                start: 0,
                variance: 0.8,
                autoupdateEveryNBeats: 1,
            },
            borderRadiusPercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                autoupdateRange: [0, 0.6],
                listenToLaunchpadKnob: [0, 2],
                monitorName: 'Roundness %',
                start: 0.3,
                variance: 0.01,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
            viewpointShiftPercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                autoupdateRange: [0.05, 0.55],
                listenToLaunchpadKnob: [0, 0],
                monitorName: 'View Shift %',
                start: 0.3,
                variance: 0.01,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
        };
    }
}

module.exports = SubjectParameters;
