const _ = require('lodash');
const {MovingIntLinearParameter, MovingLogarithmicParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

const {lerp, dist, manhattanDist, triangularDist, polarAngleDeg, posMod, modAndShiftToHalf, posModAndBendToLowerHalf} = require('js/core/utils/math');
const MAX_RIPPLES_TREAT_AS_INFINITE = 40;

class LatticeRefreshTimer extends PieceParameters {
    _declareParameters() {
        return {
            rippleRadius: {
                type: MovingLogarithmicParameter,
                range: [2, MAX_RIPPLES_TREAT_AS_INFINITE],
                start: 10,
                monitorName: 'Ripple Radius',
                listenToLaunchpadFader: [2, {addButtonStatusLight: true, useSnapButton: true}],
                listenToMixtrackWheel: MixtrackWheels.L_SELECT,
                variance: 0.2,
                autoupdateEveryNBeats: 16,
                autoupdateOnCue: true,
            },
            subdivisionSize: {
                type: MovingLogarithmicParameter,
                range: [2, MAX_RIPPLES_TREAT_AS_INFINITE],
                start: MAX_RIPPLES_TREAT_AS_INFINITE,
                listenToLaunchpadFader: [3, {addButtonStatusLight: true, useSnapButton: true}],
                monitorName: 'Division Size',
                variance: 0.2,
                autoupdateEveryNBeats: 16,
                autoupdateOnCue: true,
            },
            manhattanCoefficient: {
                type: MovingLinearParameter,
                range: [-3, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Manhattan Coeff',
                listenToLaunchpadKnob: [0, 2, {useSnapButton: true}],
                listenToMixtrackWheel: MixtrackWheels.L_CONTROL_1,
                listenToResetMixtrackButton: MixtrackButtons.L_HOT_CUE_2,
                variance: 0.05,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            logCoefficient: {
                type: MovingLinearParameter,
                range: [-3, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Logarithm Coeff',
                listenToLaunchpadKnob: [0, 3, {useSnapButton: true}],
                listenToMixtrackWheel: MixtrackWheels.L_CONTROL_2,
                listenToResetMixtrackButton: MixtrackButtons.L_HOT_CUE_3,
                variance: 0.05,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            globalPolarAngles: {
                type: MovingIntLinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: '# Global Spirals',
                listenToLaunchpadKnob: [2, 2],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
                variance: 0.3,
                autoupdateEveryNBeats: 16,
                autoupdateOnCue: true,
            },
            localPolarAngles: {
                type: MovingIntLinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: '# Local Spirals',
                listenToLaunchpadKnob: [2, 3],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                variance: 0.3,
                autoupdateEveryNBeats: 16,
                autoupdateOnCue: true,
            },
            0: P.CustomToggle({name: 'bendGlobalSpirals', button: 2}),
            1: P.CustomToggle({name: 'bendLocalSpirals', button: 3}),
        };
    }
    constructor(mixboard, beatmathParameters, {latticeParameters}) {
        super(mixboard, beatmathParameters);
        this._refreshOffsetCache = {};
        this._latticeParameters = latticeParameters;
        this._flushCacheIfNewGrid();
        this._flushCache = this._flushCache.bind(this);

        _.each(this._declareParameters(), (value, paramName) => {
            this[value.propertyName || paramName].addListener(this._flushCache);
        });
        if (this._latticeParameters.triangularGridPercent) {
            this._latticeParameters.triangularGridPercent.addListener(this._flushCacheIfNewGrid.bind(this));
        }
    }
    _isTriangularGrid() {
        return this._latticeParameters.triangularGridPercent && this._latticeParameters.triangularGridPercent.getValue() >= 0.5;
    }
    _flushCacheIfNewGrid() {
        if (this._cachedIsTriangularGrid !== this._isTriangularGrid()) {
            this._cachedIsTriangularGrid = this._isTriangularGrid();
            this._flushCache();
        }
    }
    _flushCache() {
        this._refreshOffsetCache = {};
    }
    getRefreshOffset(row, col) {
        const key = `${row}|${col}`;
        if (!_.has(this._refreshOffsetCache, key)) {
            this._refreshOffsetCache[key] = this._calculateRefreshOffset(row, col);
        }
        const offset = this._refreshOffsetCache[key];
        return offset * this._beatmathParameters.tempo.getPeriod();
    }
    _calculateRefreshOffset(row, col) {
        let total = 0;

        const rippleRadius = this.rippleRadius.getValue();

        const globalPolarAngles = this.globalPolarAngles.getValue();
        if (globalPolarAngles !== 0) {
            const sectorSize = 360 / globalPolarAngles;
            let globalPolarAngle = polarAngleDeg(col, row);
            if (this.bendGlobalSpirals.getValue()) {
                globalPolarAngle = posModAndBendToLowerHalf(globalPolarAngle, sectorSize * 2);
            }
            total += globalPolarAngle / sectorSize;

        }

        let subdivisionRadius = false;
        const subdivisionSize = this.subdivisionSize.getValue();
        if (subdivisionSize !== MAX_RIPPLES_TREAT_AS_INFINITE) {
            subdivisionRadius = subdivisionSize;
        }

        if (subdivisionRadius !== false) {
            row = modAndShiftToHalf(row, subdivisionRadius);
            col = modAndShiftToHalf(col, subdivisionRadius);
        }

        if (rippleRadius !== MAX_RIPPLES_TREAT_AS_INFINITE) {
            let distance = this.cachedIsTriangularGrid
                ? triangularDist(col, row)
                : manhattanDist(col, row);
            const manhattanCoefficient = this.manhattanCoefficient.getValue();
            const logCoefficient = this.logCoefficient.getValue();

            if (manhattanCoefficient !== 1) {
                const euclideanDistance = dist(col, row);
                distance = lerp(euclideanDistance, distance, manhattanCoefficient);
            }
            if (logCoefficient !== 0) {
                const logDistance = Math.log(distance / rippleRadius) * rippleRadius;
                distance = lerp(distance, logDistance, logCoefficient);
            }
            total += distance / rippleRadius;
        }

        const localPolarAngles = this.localPolarAngles.getValue();
        if (localPolarAngles !== 0) {
            const sectorSize = 360 / localPolarAngles;
            let localPolarAngle = polarAngleDeg(col, row);
            if (this.bendLocalSpirals.getValue()) {
                localPolarAngle = posModAndBendToLowerHalf(localPolarAngle, sectorSize * 2);
            }
            total += localPolarAngle / sectorSize;
        }

        return posMod(total, 1);
    }
}

module.exports = LatticeRefreshTimer;
