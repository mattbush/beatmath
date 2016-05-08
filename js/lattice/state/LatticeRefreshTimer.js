const _ = require('underscore');
const {LinearParameter, CycleParameter, ToggleParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
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
                listenToMixtrackWheel: MixtrackWheels.L_SELECT,
            },
            _manhattanCoefficient: {
                type: LinearParameter,
                range: [-2, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Refresh Manhattan Coeff',
                listenToMixtrackWheel: MixtrackWheels.L_CONTROL_1,
                listenToResetMixtrackButton: MixtrackButtons.L_HOT_CUE_2,
            },
            _logCoefficient: {
                type: LinearParameter,
                range: [-2, 3],
                start: 0,
                defaultOn: 1,
                incrementAmount: 0.25,
                monitorName: 'Refresh Log Coeff',
                listenToMixtrackWheel: MixtrackWheels.L_CONTROL_2,
                listenToResetMixtrackButton: MixtrackButtons.L_HOT_CUE_3,
            },
            _useDistance: {
                type: ToggleParameter,
                start: true,
                listenToMixtrackButton: MixtrackButtons.L_HOT_CUE_1,
            },
            _globalPolarAngles: {
                type: LinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: 'Refresh # Global Polar Angles',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
            },
            _localPolarAngles: {
                type: LinearParameter,
                range: [-12, 12],
                start: 0,
                monitorName: 'Refresh # Local Polar Angles',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
            },
            _bendLocalPolarAngles: {
                type: ToggleParameter,
                start: false,
                listenToMixtrackButton: MixtrackButtons.L_KEYLOCK,
            },
            _subdivisionSize: {
                type: CycleParameter,
                cycleValues: [false, 1, 2, 3],
                listenToCycleAndResetMixtrackButtons: [MixtrackButtons.L_EFFECT, MixtrackButtons.L_DELETE],
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
        const key = `${row}|${col}`;
        if (!_.has(this._refreshOffsetCache, key)) {
            this._refreshOffsetCache[key] = this._calculateRefreshOffset(row, col);
        }
        const offset = this._refreshOffsetCache[key];
        return offset * this._beatmathParameters.tempo.getPeriod();
    }
    _calculateRefreshOffset(row, col) {
        let total = 0;

        const rippleRadius = this._rippleRadius.getValue();

        const globalPolarAngles = this._globalPolarAngles.getValue();
        if (globalPolarAngles !== 0) {
            const globalPolarAngle = polarAngleDeg(col, row);
            total += globalPolarAngle * globalPolarAngles / 360;
        }

        const subdivisionSize = this._subdivisionSize.getValue();
        if (subdivisionSize !== false) {
            const subdivisionRadius = rippleRadius * subdivisionSize;
            row = modAndShiftToHalf(row, subdivisionRadius);
            col = modAndShiftToHalf(col, subdivisionRadius);
        }

        if (this._useDistance.getValue()) {
            let distance = manhattanDist(col, row);
            const manhattanCoefficient = this._manhattanCoefficient.getValue();
            const logCoefficient = this._logCoefficient.getValue();

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

        const localPolarAngles = this._localPolarAngles.getValue();
        if (localPolarAngles !== 0) {
            const sectorSize = 360 / localPolarAngles;
            let localPolarAngle = polarAngleDeg(col, row);
            if (this._bendLocalPolarAngles.getValue()) {
                localPolarAngle = posModAndBendToLowerHalf(localPolarAngle, sectorSize * 2);
            }
            total += localPolarAngle / sectorSize;
        }

        return posMod(total, 1);
    }
}

module.exports = LatticeRefreshTimer;
