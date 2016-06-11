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

        this._beatmathParameters.tempo.addListener(this._recalculateAll.bind(this));
        this._recalculateAll();
    }
    _declareParameters() {
        return {

        };
    }
    getNumRings() {
        return NUM_RINGS;
    }
    mapRings(fn) {
        return _.map(this._rings, fn);
    }
    _recalculateAll() {
        this._rings.forEach(ring => ring.recalculateNodeLocations());
    }
}

module.exports = NodesParameters;
