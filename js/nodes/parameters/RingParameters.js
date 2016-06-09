// const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

class RingParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, nodesParameters, ringIndex) {
        super(mixboard, beatmathParameters, {ringIndex})
        this._nodesParameters = nodesParameters;
    }
    _declareParameters({ringIndex}) {
        return {
            // some different default value based on numRings
        };
    }
}

module.exports = RingParameters;
