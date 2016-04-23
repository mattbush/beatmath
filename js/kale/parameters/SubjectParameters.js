const {MovingAngleParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
// const {mixboardKnob} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class SubjectParameters extends PieceParameters {
    _declareParameters() {
        return {
            outerRotateDeg: {
                type: MovingAngleParameter,
                max: 10,
                variance: 0.4,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
            },
            innerRotateDeg: {
                type: MovingAngleParameter,
                max: 10,
                variance: 0.4,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
            },
            outerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [4, 6],
                start: 5,
                variance: 0.1,
                autoupdateEveryNBeats: 1,
            },
            innerScaleAmountLog2: {
                type: MovingLinearParameter,
                range: [2, 4],
                start: 3,
                variance: 0.1,
                autoupdateEveryNBeats: 1,
            },
            driftX: {
                type: MovingLinearParameter,
                range: [-10, 10],
                start: 0,
                variance: 0.5,
                autoupdateEveryNBeats: 1,
            },
            driftY: {
                type: MovingLinearParameter,
                range: [-10, 10],
                start: 0,
                variance: 0.5,
                autoupdateEveryNBeats: 1,
            },
        };
    }
}

module.exports = SubjectParameters;
