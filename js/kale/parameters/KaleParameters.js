const {ToggleParameter} = require('js/core/parameters/Parameter');
// const {mixboardKnob} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class KaleParameters extends PieceParameters {
    _declareParameters() {
        return {
            isInfinite: {
                type: ToggleParameter,
                start: false,
            },
            isSixCelled: {
                type: ToggleParameter,
                start: false,
            },
        };
    }
}

module.exports = KaleParameters;
