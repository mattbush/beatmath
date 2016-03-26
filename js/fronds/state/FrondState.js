// var {LinearParameter} = require('js/core/parameters/Parameter');
// var {mixboardKnob} = require('js/core/inputs/MixboardConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class FrondState extends PieceParameters {
    constructor(mixboard, beatmathParameters, frondsParameters) {
        super(mixboard, beatmathParameters);
        this._frondsParameters = frondsParameters;
    }
}

module.exports = FrondState;
