// const _ = require('lodash');
const {Parameter, MovingIntLinearParameter, LinearParameter, IntLinearParameter, MovingLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
const PieceParameters = require('js/core/parameters/PieceParameters');
const StopwatchVisList = require('js/stopwatch/parameters/StopwatchVisList');
const {clamp, modAndShiftToHalf} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');

class StopwatchParameters extends PieceParameters {
    constructor(...args) {
        super(...args);

        this._visList = new StopwatchVisList(this);

        this._beatmathParameters.tempo.addListener(this._tick.bind(this));
        this._tick();
    }
    _declareParameters() {
        return {
            baseColor: {
                type: MovingColorParameter,
                start: tinycolor('#5ff'),
                max: 5,
                variance: 1,
                autoupdate: 1000,
            },
            numVisibleTrails: {
                type: IntLinearParameter,
                range: [4, 20],
                start: 16,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: '# Visible Trails',
            },
            numTrailsChanged: {
                type: Parameter,
                start: null,
            },
            hidePercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                autoupdateRange: [0, 0.6],
                start: 0.5,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: 'Hide %',
                variance: 0.02,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            trailLength: {
                type: IntLinearParameter,
                range: [1, 64],
                start: 16,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'Trail Length',
            },
            numTicksPerShuffle: {
                type: MovingIntLinearParameter,
                range: [1, 8],
                start: 3,
                listenToLaunchpadFader: [3, {addButtonStatusLight: true}],
                monitorName: 'Num Ticks Per Shuffle',
                variance: 0.4,
                autoupdateEveryNBeats: 32,
                autoupdateOnCue: true,
            },
            attackPercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0.5,
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                monitorName: 'Attack %',
                variance: 0.05,
                autoupdateEveryNBeats: 32,
                autoupdateOnCue: true,
            },
            delayCoefficient: {
                type: LinearParameter,
                range: [0.5, 1.5],
                start: 1,
                listenToLaunchpadKnob: [0, 5],
                monitorName: 'Delay Coeff',
            },
            columnColorShift: {
                type: MovingLinearParameter,
                range: [-45, 45],
                start: 0,
                monitorName: 'Column Color Shift',
                listenToLaunchpadKnob: [0, 0],
                variance: 0.25,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
            rowColorShift: {
                type: MovingLinearParameter,
                range: [-45, 45],
                start: 0,
                monitorName: 'Row Color Shift',
                listenToLaunchpadKnob: [0, 1],
                variance: 0.25,
                autoupdateEveryNBeats: 1,
                autoupdateOnCue: true,
            },
            polarGridAmount: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0, buildupStart: 0,
                incrementAmount: 0.05,
                listenToLaunchpadKnob: [1, 0],
                monitorName: 'Polar Grid %',
                variance: 0.15,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            crisscrossPercent: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 1,
                listenToLaunchpadKnob: [2, 3],
                monitorName: 'Crisscross %',
                variance: 0.02,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            hideRandomly: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 3,
                monitorName: 'Hide Randomly',
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
    _getColorShiftPerColumn() {
        const baseColorShift = this.columnColorShift.getValue();
        const polarGridAmount = clamp(this.polarGridAmount.getValue(), 0, 1);
        if (polarGridAmount === 0) {
            return baseColorShift;
        }
        const colorShiftForAFullRotation = 360 / this.numVisibleTrails.getValue();
        const distanceFromClosestMultiple = modAndShiftToHalf(baseColorShift, colorShiftForAFullRotation);
        return baseColorShift - (distanceFromClosestMultiple * polarGridAmount);
    }
    getColorForTrailAndTick(trailIndex, tickIndex) {
        const color = tinycolor(this.baseColor.getValue().toHexString()); // clone
        const colorShiftPerColumn = this._getColorShiftPerColumn();
        const colorShiftPerRow = this.rowColorShift.getValue();
        const colorShift = colorShiftPerColumn * trailIndex + colorShiftPerRow * tickIndex;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        return color;
    }
}

module.exports = StopwatchParameters;
