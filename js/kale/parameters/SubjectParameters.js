const {MovingAngleParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {mixboardKnob} = require('js/core/inputs/MixboardConstants');
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
            },
            innerRotation: {
                type: MovingAngleParameter,
                max: 45,
                variance: 5,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
            },
            outerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [4, 5],
                start: 4.5,
                variance: 0.15,
                autoupdateEveryNBeats: 1,
            },
            innerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [0.5, 1.5],
                start: 1,
                variance: 0.15,
                autoupdateEveryNBeats: 1,
            },
            driftX: {
                type: MovingLinearParameter,
                range: [-10, 10],
                start: 0,
                variance: 0.8,
                autoupdateEveryNBeats: 1,
            },
            driftY: {
                type: MovingLinearParameter,
                range: [-10, 10],
                start: 0,
                variance: 0.8,
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
                range: [0, 0.5],
                start: 0.25,
                variance: 0.01,
                autoupdateEveryNBeats: 1,
            },
        };
    }
}

module.exports = SubjectParameters;
