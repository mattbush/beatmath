// const _ = require('lodash');
const {LinearParameter, IntLinearParameter} = require('js/core/parameters/Parameter');
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
                range: [2, 8],
                start: 4,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: '# Visible Trails',
            },
            hidePercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: 'Hide %',
            },
            trailLength: {
                type: IntLinearParameter,
                range: [1, 32],
                start: 8,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'Trail Length',
            },
        };
    }
}

module.exports = StopwatchParameters;
