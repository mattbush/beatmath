var _ = require('underscore');
var {CycleParameter} = require('js/parameters/Parameter');
var {mixboardButton} = require('js/inputs/MixboardConstants');

const {PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');
const {lerp, dist, manhattanDist, polarAngleDeg, posMod, modAndShiftToHalf, posModAndBendToLowerHalf} = require('js/utils/math');

const USE_DISTANCE = true;

const NUM_GLOBAL_POLAR_ANGLES = 0;

const RIPPLE_RADIUS = 10;
const MANHATTAN_COEFFICIENT = 1;
const LOG_COEFFICIENT = 0;

const NUM_LOCAL_POLAR_ANGLES = 0;
const BEND_LOCAL_POLAR_ANGLES = true;

class LatticeRefreshTimer {
    constructor({mixboard, latticeParameters}) {
        this._refreshOffsetCache = {};
        this._latticeParameters = latticeParameters;

        this._flushCache = this._flushCache.bind(this);

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

        if (NUM_GLOBAL_POLAR_ANGLES !== 0) {
            var globalPolarAngle = polarAngleDeg(col, row);
            total += globalPolarAngle * NUM_GLOBAL_POLAR_ANGLES / 360;
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

        if (NUM_LOCAL_POLAR_ANGLES !== 0) {
            var sectorSize = 360 / NUM_LOCAL_POLAR_ANGLES;
            var localPolarAngle = polarAngleDeg(col, row);
            if (BEND_LOCAL_POLAR_ANGLES) {
                localPolarAngle = posModAndBendToLowerHalf(localPolarAngle, sectorSize * 2);
            }
            total += localPolarAngle / sectorSize;
        }

        return posMod(total, 1) * PIXEL_REFRESH_RATE;
    }
}

module.exports = LatticeRefreshTimer;
