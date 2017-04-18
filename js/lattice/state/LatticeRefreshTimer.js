const _ = require('lodash');
const {MovingIntLinearParameter, MovingLogarithmicParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

const {lerp, dist, manhattanDist, triangularDist, polarAngleDeg, posMod, modAndShiftToHalfZigzag, posModAndBendToLowerHalf} = require('js/core/utils/math');
const MAX_RIPPLES_TREAT_AS_INFINITE = 30;

const EPSILON = 0.01;

class LatticeRefreshTimer extends PieceParameters {
    _declareParameters() {
        return {
            rippleRadius: {
                type: MovingLogarithmicParameter,
                range: [2, MAX_RIPPLES_TREAT_AS_INFINITE],
                autoupdateRange: [5, MAX_RIPPLES_TREAT_AS_INFINITE],
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
                autoupdateRange: [8, MAX_RIPPLES_TREAT_AS_INFINITE],
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
                autoupdateRange: [-0.5, 1.5],
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
                autoupdateRange: [-0.5, 1.5],
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
                autoupdateRange: [-5, 5],
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
                autoupdateRange: [-5, 5],
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
    constructor(mixboard, beatmathParameters, {pieceParameters}) {
        super(mixboard, beatmathParameters);
        this._refreshOffsetCache = {};
        this._refreshGradientCache = {};
        this._pieceParameters = pieceParameters;
        this._flushCacheIfNewGrid();
        this._flushCache = this._flushCache.bind(this);

        _.each(this._declareParameters(), (value, paramName) => {
            this[value.propertyName || paramName].addListener(this._flushCache);
        });
        if (this._pieceParameters.triangularGridPercent) {
            this._pieceParameters.triangularGridPercent.addListener(this._flushCacheIfNewGrid.bind(this));
        }
        if (this._pieceParameters.perpendicularFlip) {
            this._pieceParameters.perpendicularFlip.addListener(this._flushCacheIfNewGrid.bind(this));
        }
    }
    _isTriangularGrid() {
        return this._pieceParameters.triangularGridPercent && this._pieceParameters.triangularGridPercent.getValue() >= 0.5;
    }
    _isPerpendicularFlip() {
        return this._pieceParameters.perpendicularFlip && this._pieceParameters.perpendicularFlip.getValue();
    }
    _flushCacheIfNewGrid() {
        let didChange = false;
        if (this._cachedIsTriangularGrid !== this._isTriangularGrid()) {
            this._cachedIsTriangularGrid = this._isTriangularGrid();
            didChange = true;
        }
        if (this._cachedPerpendicularFlip !== this._isPerpendicularFlip()) {
            this._cachedPerpendicularFlip = this._isPerpendicularFlip();
            didChange = true;
        }
        if (didChange) {
            this._flushCache();
        }
    }
    _flushCache() {
        this._refreshOffsetCache = {};
        this._refreshGradientCache = {};
    }
    getRefreshOffset(row, col) {
        const key = `${row}|${col}`;
        if (!_.has(this._refreshOffsetCache, key)) {
            this._refreshOffsetCache[key] = posMod(this._calculateRefreshOffset(row, col), 1);
        }
        const offset = this._refreshOffsetCache[key];
        return offset * this._beatmathParameters.tempo.getPeriod();
    }
    getRefreshGradient(row, col) {
        const key = `${row}|${col}`;
        if (!_.has(this._refreshGradientCache, key)) {
            this._refreshGradientCache[key] = this._calculateRefreshGradient(row, col);
        }
        return this._refreshGradientCache[key];
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
            row = modAndShiftToHalfZigzag(row, subdivisionRadius);
            col = modAndShiftToHalfZigzag(col, subdivisionRadius);
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

        let localPolarAngles = this._localPolarAngles.getValue();
        if (localPolarAngles !== 0) {
            if (localPolarAngles >= 4) { // nobody likes 4-spirals, awkward
                localPolarAngles++;
            } else if (localPolarAngles <= -4) {
                localPolarAngles--;
            }
            const sectorSize = 360 / localPolarAngles;
            let localPolarAngle = polarAngleDeg(col, row);
            if (this.bendLocalSpirals.getValue()) {
                localPolarAngle = posModAndBendToLowerHalf(localPolarAngle, sectorSize * 2);
            }
            total += localPolarAngle / sectorSize;
        }

        return total;
    }
    _calculateRefreshGradient(row, col) {
        const main = this._calculateRefreshOffset(row, col);
        const mainPlusDeltaX = this._calculateRefreshOffset(row, col + EPSILON);
        const mainPlusDeltaY = this._calculateRefreshOffset(row + EPSILON, col);

        if (this._cachedPerpendicularFlip) {
            return {
                x: mainPlusDeltaX - main,
                y: mainPlusDeltaY - main,
            };
        } else {
            return {
                x: mainPlusDeltaY - main,
                y: main - mainPlusDeltaX,
            };
        }
    }
}

module.exports = LatticeRefreshTimer;
