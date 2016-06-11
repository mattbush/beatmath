const _ = require('underscore');
// const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const RingParameters = require('js/nodes/parameters/RingParameters');

const NUM_RINGS = 4;

class NodesParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        super(...arguments);

        this._animationFrameListeners = [];
        this._rings = _.times(NUM_RINGS, ringIndex =>
            new RingParameters(mixboard, beatmathParameters, this, ringIndex)
        );

        this._beatmathParameters.tempo.addListener(this._recalculateAll.bind(this));
        this._recalculateAll();

        this._onAnimationFrame = this._onAnimationFrame.bind(this);
        requestAnimationFrame(this._onAnimationFrame);
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
    mapEdges(fn) {
        return this._rings.map(ring => ring.mapEdges(fn));
    }
    _recalculateAll() {
        this._rings.forEach(ring => ring.recalculateNodeLocations());
        this._tickStart = Date.now();
    }
    _onAnimationFrame(timestamp) {
        this._animationFrameListeners.forEach(fn => fn(timestamp));
        requestAnimationFrame(this._onAnimationFrame);
    }
    addAnimationFrameListener(fn) {
        this._animationFrameListeners.push(fn);
    }
    removeAnimationFrameListener(fn) {
        this._animationFrameListeners = this._animationFrameListeners.filter(listener => listener !== fn);
    }
}

module.exports = NodesParameters;
