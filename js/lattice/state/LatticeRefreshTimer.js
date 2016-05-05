var _ = require('underscore');
var {LinearParameter, CycleParameter, ToggleParameter} = require('js/core/parameters/Parameter');
var {MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');

const {lerp, dist, manhattanDist, polarAngleDeg, posMod, modAndShiftToHalf, posModAndBendToLowerHalf} = require('js/core/utils/math');

class LatticeRefreshTimer extends PieceParameters {
    _declareParameters() {
        return {
            _rippleRadius: {
                type: LinearParameter,
                range: [2, 40],
                start: 10,
                monitorName: 'Refresh Ripple Radius',
                listenToWheel: MixtrackWheels.L_SELECT,
            },
            _manhattanCoefficient: {
                type: LinearParameter,
                range: [-2, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Refresh Manhattan Coeff',
                listenToWheel: MixtrackWheels.L_CONTROL_1,
                listenToResetButton: MixtrackButtons.L_HOT_CUE_2,
            },
            _logCoefficient: {
                type: LinearParameter,
                range: [-2, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Refresh Log Coeff',
                listenToWheel: MixtrackWheels.L_CONTROL_2,
                listenToResetButton: MixtrackButtons.L_HOT_CUE_3,
            },
            _useDistance: {
                type: ToggleParameter,
                start: true,
                listenToButton: MixtrackButtons.L_HOT_CUE_1,
            },
            _globalPolarAngles: {
                type: LinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: 'Refresh # Global Polar Angles',
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
            },
            _localPolarAngles: {
                type: LinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: 'Refresh # Local Polar Angles',
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
            },
            _bendLocalPolarAngles: {
                type: ToggleParameter,
                start: false,
                listenToButton: MixtrackButtons.L_KEYLOCK,
            },
            _subdivisionSize: {
                type: CycleParameter,
                cycleValues: [false, 1, 2, 3],
                listenToCycleAndResetButtons: [MixtrackButtons.L_EFFECT, MixtrackButtons.L_DELETE],
            },
        };
    }
    constructor() {
        super(...arguments);
        this._refreshOffsetCache = {};
        this._flushCache = this._flushCache.bind(this);

        _.each(this._declareParameters(), (value, paramName) => {
            this[paramName].addListener(this._flushCache);
        });
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
