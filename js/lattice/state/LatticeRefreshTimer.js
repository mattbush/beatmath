var _ = require('underscore');
var {LinearParameter, CycleParameter, ToggleParameter} = require('js/core/parameters/Parameter');
var {mixboardButton, mixboardWheel} = require('js/core/inputs/MixboardConstants');

const {lerp, dist, manhattanDist, polarAngleDeg, posMod, modAndShiftToHalf, posModAndBendToLowerHalf} = require('js/core/utils/math');

class LatticeRefreshTimer {
    constructor({mixboard, beatmathParameters, latticeParameters}) {
        this._refreshOffsetCache = {};
        this._beatmathParameters = beatmathParameters;
        this._latticeParameters = latticeParameters;

        this._flushCache = this._flushCache.bind(this);

        this._rippleRadius = new LinearParameter({
            start: 10, min: 2, max: 40,
        });
        this._rippleRadius.listenToWheel(mixboard, mixboardWheel.L_SELECT);
        this._rippleRadius.addListener(this._flushCache);

        this._manhattanCoefficient = new LinearParameter({
            start: 0, defaultOn: 1, min: -2, max: 3, incrementAmount: 0.25,
        });
        this._manhattanCoefficient.listenToWheel(mixboard, mixboardWheel.L_CONTROL_1);
        this._manhattanCoefficient.listenToResetButton(mixboard, mixboardButton.L_HOT_CUE_2);
        this._manhattanCoefficient.addStatusLight(mixboard, mixboardButton.L_HOT_CUE_2, value => value > 0);
        this._manhattanCoefficient.addListener(this._flushCache);

        this._logCoefficient = new LinearParameter({
            start: 0, defaultOn: 1, min: -2, max: 3, incrementAmount: 0.25,
        });
        this._logCoefficient.listenToWheel(mixboard, mixboardWheel.L_CONTROL_2);
        this._logCoefficient.listenToResetButton(mixboard, mixboardButton.L_HOT_CUE_3);
        this._logCoefficient.addStatusLight(mixboard, mixboardButton.L_HOT_CUE_3, value => value > 0);
        this._logCoefficient.addListener(this._flushCache);

        this._useDistance = new ToggleParameter({
            start: true,
        });
        this._useDistance.listenToButton(mixboard, mixboardButton.L_HOT_CUE_1);
        this._useDistance.addStatusLight(mixboard, mixboardButton.L_HOT_CUE_1);
        this._useDistance.addListener(this._flushCache);

        this._globalPolarAngles = new LinearParameter({
            start: 0, min: -12, max: 12,
        });
        this._globalPolarAngles.listenToIncrementButton(mixboard, mixboardButton.L_LOOP_IN);
        this._globalPolarAngles.listenToDecrementButton(mixboard, mixboardButton.L_LOOP_MANUAL);
        this._globalPolarAngles.addStatusLight(mixboard, mixboardButton.L_LOOP_IN, value => value > 0);
        this._globalPolarAngles.addStatusLight(mixboard, mixboardButton.L_LOOP_MANUAL, value => value < 0);
        this._globalPolarAngles.addListener(this._flushCache);

        this._localPolarAngles = new LinearParameter({
            start: 0, min: -12, max: 12,
        });
        this._localPolarAngles.listenToIncrementButton(mixboard, mixboardButton.L_LOOP_RELOOP);
        this._localPolarAngles.listenToDecrementButton(mixboard, mixboardButton.L_LOOP_OUT);
        this._localPolarAngles.addStatusLight(mixboard, mixboardButton.L_LOOP_RELOOP, value => value > 0);
        this._localPolarAngles.addStatusLight(mixboard, mixboardButton.L_LOOP_OUT, value => value < 0);
        this._localPolarAngles.addListener(this._flushCache);

        this._bendLocalPolarAngles = new ToggleParameter({
            start: false,
        });
        this._bendLocalPolarAngles.listenToButton(mixboard, mixboardButton.L_KEYLOCK);
        this._bendLocalPolarAngles.addStatusLight(mixboard, mixboardButton.L_KEYLOCK);
        this._bendLocalPolarAngles.addListener(this._flushCache);

        this._subdivisionSize = new CycleParameter({
            cycleValues: [false, 1, 2, 3],
        });
        this._subdivisionSize.listenToCycleButton(mixboard, mixboardButton.L_EFFECT);
        this._subdivisionSize.listenToResetButton(mixboard, mixboardButton.L_DELETE);
        this._subdivisionSize.addStatusLight(mixboard, mixboardButton.L_EFFECT);
        this._subdivisionSize.addListener(this._flushCache);
    }
    _flushCache() {
        this._refreshOffsetCache = {};
    }
    getRefreshOffset(row, col) {
        var key = `${row}|${col}`;
        if (!_.has(this._refreshOffsetCache, key)) {
            this._refreshOffsetCache[key] = this._calculateRefreshOffset(row, col);
        }
        var offset = this._refreshOffsetCache[key];
        return offset * this._beatmathParameters.tempo.getPeriod();
    }
    _calculateRefreshOffset(row, col) {
        var total = 0;

        var rippleRadius = this._rippleRadius.getValue();

        var globalPolarAngles = this._globalPolarAngles.getValue();
        if (globalPolarAngles !== 0) {
            var globalPolarAngle = polarAngleDeg(col, row);
            total += globalPolarAngle * globalPolarAngles / 360;
        }

        var subdivisionSize = this._subdivisionSize.getValue();
        if (subdivisionSize !== false) {
            var subdivisionRadius = rippleRadius * subdivisionSize;
            row = modAndShiftToHalf(row, subdivisionRadius);
            col = modAndShiftToHalf(col, subdivisionRadius);
        }

        if (this._useDistance.getValue()) {
            var distance = manhattanDist(col, row);
            var manhattanCoefficient = this._manhattanCoefficient.getValue();
            var logCoefficient = this._logCoefficient.getValue();

            if (manhattanCoefficient !== 1) {
                var euclideanDistance = dist(col, row);
                distance = lerp(euclideanDistance, distance, manhattanCoefficient);
            }
            if (logCoefficient !== 0) {
                var logDistance = Math.log(distance / rippleRadius) * rippleRadius;
                distance = lerp(distance, logDistance, logCoefficient);
            }
            total += distance / rippleRadius;
        }

        var localPolarAngles = this._localPolarAngles.getValue();
        if (localPolarAngles !== 0) {
            var sectorSize = 360 / localPolarAngles;
            var localPolarAngle = polarAngleDeg(col, row);
            if (this._bendLocalPolarAngles.getValue()) {
                localPolarAngle = posModAndBendToLowerHalf(localPolarAngle, sectorSize * 2);
            }
            total += localPolarAngle / sectorSize;
        }

        return posMod(total, 1);
    }
}

module.exports = LatticeRefreshTimer;