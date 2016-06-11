const _ = require('underscore');
const {LinearParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
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
            ringSpacing: {
                type: LinearParameter,
                range: [0, 2],
                start: 0,
                monitorName: 'Ring Spacing',
                listenToLaunchpadKnob: [0, 4],
            },
            manhattanCoeff: {
                type: MovingLinearParameter,
                range: [-3, 3],
                start: 0,
                monitorName: 'Manhattan Coeff',
                listenToLaunchpadKnob: [0, 5, {useSnapButton: true}],
                variance: 0.05,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            distanceCutoff: {
                type: MovingLinearParameter,
                range: [0, 0.5],
                start: 0.15,
                monitorName: 'Distance Cutoff',
                listenToLaunchpadKnob: [1, 5],
                variance: 0.006,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            distancePercentage: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0,
                monitorName: 'Distance %',
                listenToLaunchpadKnob: [2, 5],
                variance: 0.01,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
        };
    }
    getDistanceCutoff() {
        return this.distanceCutoff.getValue();
    }
    getDistanceModifier() {
        return 1 + (this.manhattanCoeff.getValue() / 3);
    }
    getDistancePercentage() {
        return this.distancePercentage.getValue();
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
