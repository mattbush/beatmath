const _ = require('underscore');
// const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const RingParameters = require('js/nodes/parameters/RingParameters');

const NUM_RINGS = 4;

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
    getNumRings() {
        return this._rings.length;
    }
    mapRings(fn) {
        return _.map(this._rings, fn);
    }
}

module.exports = NodesParameters;
