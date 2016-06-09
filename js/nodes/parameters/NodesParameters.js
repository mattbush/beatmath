// const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

const NUM_RINGS = 0;

class NodesParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        super(...arguments);

        this._rings = _.times(NUM_RINGS, ringIndex =>
            new RingParameters(mixboard, beatmathParameters, this, ringIndex)
        );
    }
    _declareParameters() {
        return {

        };
    }
}

module.exports = NodesParameters;
