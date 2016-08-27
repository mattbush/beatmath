const {LinearParameter, MovingAngleParameter, MovingLinearParameter, MovingLogarithmicParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SubjectParameters extends PieceParameters {
    _declareParameters() {
        return {
            outerRotation: {
                type: MovingAngleParameter,
                max: 20,
                variance: 2,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
                listenToLaunchpadKnob: [2, 4],
                monitorName: 'Outer Rotation',
                autoupdateOnCue: true,
                knobSensitivity: 0.1,
                numUpdatesPerBasePeriod: 4,
            },
            innerRotation: {
                type: MovingAngleParameter,
                max: 20,
                variance: 2,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
                listenToLaunchpadKnob: [2, 5],
                monitorName: 'Inner Rotation',
                autoupdateOnCue: true,
                knobSensitivity: 0.1,
                numUpdatesPerBasePeriod: 4,
            },
            outerScaleAmount: {
                type: MovingLogarithmicParameter,
                range: [0.25, 4],
                autoupdateRange: [0.3, 2.4],
                start: 1,
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                monitorName: 'Outer Scale',
                variance: 0.15,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
            innerScaleAmount: {
                type: MovingLogarithmicParameter,
                range: [1, 4],
                autoupdateRange: [1.25, 2.5],
                start: 1.75,
                listenToLaunchpadFader: [5, {addButtonStatusLight: true}],
                monitorName: 'Inner Scale',
                variance: 0.15,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
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
            driftPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToLaunchpadKnob: [0, 5],
                monitorName: 'Drift %',
            },
            borderRadiusPercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                autoupdateRange: [0, 0.6],
                listenToLaunchpadKnob: [0, 4],
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
                start: 0.3,
                mixboardStart: 1,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'View Shift %',
                variance: 0.01,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
        };
    }
}

module.exports = SubjectParameters;
