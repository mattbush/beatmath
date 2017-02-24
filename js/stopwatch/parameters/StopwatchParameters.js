// const _ = require('lodash');
const {Parameter, LinearParameter, IntLinearParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const StopwatchVisList = require('js/stopwatch/parameters/StopwatchVisList');

class StopwatchParameters extends PieceParameters {
    constructor(...args) {
        super(...args);

        this._visList = new StopwatchVisList(this);

        this._beatmathParameters.tempo.addListener(this._tick.bind(this));
        this._tick();
    }
    _declareParameters() {
        return {
            numVisibleTrails: {
                type: IntLinearParameter,
                range: [4, 20],
                start: 10,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: '# Visible Trails',
            },
            numTrailsChanged: {
                type: Parameter,
                start: null,
            },
            hidePercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.25,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: 'Hide %',
            },
            trailLength: {
                type: IntLinearParameter,
                range: [1, 64],
                start: 48,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'Trail Length',
            },
            numTicksPerShuffle: {
                type: IntLinearParameter,
                range: [1, 32],
                start: 16,
                listenToLaunchpadFader: [3, {addButtonStatusLight: true}],
                monitorName: 'Num Ticks Per Shuffle',
            },
            attackPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                monitorName: 'Attack %',
            },
        };
    }
    getTrailCount() {
        return this._visList.getOverallCount();
    }
    getVisibleIndexForTrailId(trailId) {
        return this._visList.getVisibleIndexForId(trailId);
    }
    _tick() {
        if (this._beatmathParameters.tempo.getNumTicks() % this.numTicksPerShuffle.getValue() === 0) {
            this._visList.update();
        }
    }
}

module.exports = StopwatchParameters;
