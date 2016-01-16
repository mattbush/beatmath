var _ = require('underscore');
var {LinearParameter, CycleParameter, ToggleParameter} = require('js/parameters/Parameter');
var {mixboardButton} = require('js/inputs/MixboardConstants');

const {PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');
const {lerp, dist, manhattanDist, polarAngleDeg, posMod, modAndShiftToHalf, posModAndBendToLowerHalf} = require('js/utils/math');

const USE_DISTANCE = true;

const RIPPLE_RADIUS = 10;
const MANHATTAN_COEFFICIENT = 1;
const LOG_COEFFICIENT = 0;

class LatticeRefreshTimer {
    constructor({mixboard, latticeParameters}) {
        this._refreshOffsetCache = {};
        this._latticeParameters = latticeParameters;

        this._flushCache = this._flushCache.bind(this);

        this._globalPolarAngles = new LinearParameter({
            start: 0, min: -12, max: 12,
        });
        this._globalPolarAngles.listenToIncrementButton(mixboard, mixboardButton.L_LOOP_IN);
        this._globalPolarAngles.listenToDecrementButton(mixboard, mixboardButton.L_LOOP_MANUAL);
        this._globalPolarAngles.addListener(this._flushCache);

        this._localPolarAngles = new LinearParameter({
            start: 0, min: -12, max: 12,
        });
        this._localPolarAngles.listenToIncrementButton(mixboard, mixboardButton.L_LOOP_RELOOP);
        this._localPolarAngles.listenToDecrementButton(mixboard, mixboardButton.L_LOOP_OUT);
        this._localPolarAngles.addListener(this._flushCache);

        this._bendLocalPolarAngles = new ToggleParameter({
            start: false,
        });
        this._bendLocalPolarAngles.listenToButton(mixboard, mixboardButton.L_KEYLOCK);
        this._bendLocalPolarAngles.addListener(this._flushCache);

        this._subdivisionSize = new CycleParameter({
            cycleValues: [false, 1, 2, 3],
        });
        this._subdivisionSize.listenToCycleButton(mixboard, mixboardButton.L_EFFECT);
        this._subdivisionSize.listenToResetButton(mixboard, mixboardButton.L_DELETE);
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
        return this._refreshOffsetCache[key];
    }
    _calculateRefreshOffset(row, col) {
        var total = 0;

        var globalPolarAngles = this._globalPolarAngles.getValue();
        if (globalPolarAngles !== 0) {
            var globalPolarAngle = polarAngleDeg(col, row);
            total += globalPolarAngle * globalPolarAngles / 360;
        }

        var subdivisionSize = this._subdivisionSize.getValue();
        if (subdivisionSize !== false) {
            var subdivisionRadius = RIPPLE_RADIUS * subdivisionSize;
            row = modAndShiftToHalf(row, subdivisionRadius);
            col = modAndShiftToHalf(col, subdivisionRadius);
        }

        if (USE_DISTANCE) {
            var distance = manhattanDist(col, row);
            if (MANHATTAN_COEFFICIENT !== 1) {
                var euclideanDistance = dist(col, row);
                distance = lerp(euclideanDistance, distance, MANHATTAN_COEFFICIENT);
            }
            if (LOG_COEFFICIENT !== 0) {
                var logDistance = Math.log(distance / RIPPLE_RADIUS) * RIPPLE_RADIUS;
                distance = lerp(distance, logDistance, LOG_COEFFICIENT);
            }
            total += distance / RIPPLE_RADIUS;
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

        return posMod(total, 1) * PIXEL_REFRESH_RATE;
    }
}

module.exports = LatticeRefreshTimer;
