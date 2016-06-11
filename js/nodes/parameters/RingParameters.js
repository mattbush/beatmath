const _ = require('underscore');
const {IntLinearParameter, MovingAngleParameter, LinearParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {xyFromPolarAngleAndRadius} = require('js/core/utils/math');
const Node = require('js/nodes/parameters/Node');

class RingParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, nodesParameters, ringIndex) {
        super(mixboard, beatmathParameters, {nodesParameters, ringIndex});
        this._nodesParameters = nodesParameters;
        this.numNodesInRing.addListener(this._onNumNodesInRingChange.bind(this));
        this._nodesInRing = [];
        this._onNumNodesInRingChange();
    }
    _declareParameters({nodesParameters, ringIndex}) {
        const prettyRingIndex = (ringIndex + 1) + ' '; // put a ring on it!

        return {
            numNodesInRing: {
                type: IntLinearParameter,
                range: [0, 16],
                start: ringIndex ? 1 : 1,
                listenToLaunchpadFader: [ringIndex, {addButtonStatusLight: true}],
                monitorName: prettyRingIndex + '# Nodes',
            },
            ringRotation: {
                type: MovingAngleParameter,
                max: 20,
                variance: 3,
                start: 0,
                constrainTo: false,
                autoupdateEveryNBeats: 1,
                listenToLaunchpadKnob: [2, ringIndex],
                monitorName: prettyRingIndex + 'Ring Rotation',
                autoupdateOnCue: true,
                tempo: this._beatmathParameters.tempo,
            },
            ringScale: {
                type: LinearParameter,
                range: [0, 1],
                start: (ringIndex + 1) / nodesParameters.getNumRings(),
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [1, ringIndex],
                monitorName: prettyRingIndex + 'Ring Scale',
            },
            nodeFreedomFromRingAmount: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [0, ringIndex],
                monitorName: prettyRingIndex + 'Node Freed %',
            },
        };
    }
    _onNumNodesInRingChange() {
        const numNodesInRing = this.numNodesInRing.getValue();

        for (let i = this._nodesInRing.length; i < numNodesInRing; i++) {
            this._nodesInRing.push(new Node(this._mixboard, this._beatmathParameters, this, i));
        }
        for (let i = this._nodesInRing.length; i > numNodesInRing; i--) {
            this._nodesInRing.pop();
        }
    }
    getRingCoordsForIndex(index) {
        const baseAngleForIndex = index * (360 / this.numNodesInRing.getValue());
        const finalAngle = baseAngleForIndex + this.ringRotation.getValue();
        const radius = this.ringScale.getValue();

        return xyFromPolarAngleAndRadius(finalAngle, radius);
    }
    mapNodesInRing(fn) {
        return _.map(this._nodesInRing, fn);
    }
    recalculateNodeLocations() {
        this._nodesInRing.forEach(node => node.recalculateLocation());
    }
}

module.exports = RingParameters;
