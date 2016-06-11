const {MovingLinearParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {lerp} = require('js/core/utils/math');

class Node extends PieceParameters {
    constructor(mixboard, beatmathParameters, ringParameters, indexInRing) {
        super(mixboard, beatmathParameters);
        this._ringParameters = ringParameters;
        this._indexInRing = indexInRing;
        this._neighboringNodes = [];
        this._id = this._ringParameters.getId() + '~' + this._indexInRing;
    }
    _declareParameters() {
        return {
            _driftX: {
                type: MovingLinearParameter,
                range: [-1, 1],
                start: 0,
                variance: 0.05,
            },
            _driftY: {
                type: MovingLinearParameter,
                range: [-1, 1],
                start: 0,
                variance: 0.05,
            },
        };
    }
    getId() {
        return this._id;
    }
    addEdgeWith(otherNode) {
        this._neighboringNodes.push(otherNode);
    }
    mapEdges(fn) {
        return this._neighboringNodes.map(otherNode => fn(otherNode, this));
    }
    recalculateLocation() {
        this._driftX.update();
        this._driftY.update();

        const {x: ringX, y: ringY} = this._ringParameters.getRingCoordsForIndex(this._indexInRing);

        const nodeFreedomFromRingAmount = this._ringParameters.nodeFreedomFromRingAmount.getValue();

        this.x = lerp(ringX, this._driftX.getValue(), nodeFreedomFromRingAmount);
        this.y = lerp(ringY, this._driftY.getValue(), nodeFreedomFromRingAmount);
    }
}

module.exports = Node;
