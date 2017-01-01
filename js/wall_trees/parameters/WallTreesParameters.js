const {MovingLinearParameter, LogarithmicParameter, LinearParameter, HoldButtonParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {arclerp} = require('js/core/utils/math');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');

const NUM_TREES = 4;
const NUM_LEVELS = 60;

const PI_TIMES_2 = Math.PI * 2;

const WHITE = tinycolor('#fff');
const BLACK = tinycolor('#000');

class WallTreesParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        super(...arguments);

        this._riseNumTicks = 0;
        this._sineNumTicks = 0;

        beatmathParameters.tempo.addListener(this._incrementNumTicks.bind(this));
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
            periodTicks: {type: LogarithmicParameter,
                range: [2, 16],
                start: 2,
                listenToDecrementAndIncrementLaunchpadButtons: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                monitorName: 'Period Ticks',
            },
            columnColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Column Color Shift',
                listenToLaunchpadKnob: [0, 0],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_DELETE, MixtrackButtons.L_HOT_CUE_1],
                variance: 5,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            rowColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Row Color Shift',
                listenToLaunchpadKnob: [0, 1],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_HOT_CUE_2, MixtrackButtons.L_HOT_CUE_3],
                variance: 5,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            trailPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5, buildupStart: 0,
                incrementAmount: 0.05,
                monitorName: 'Trail %',
                listenToLaunchpadKnob: [2, 2],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
            },
            revTrailPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                monitorName: 'Rev Trail %',
                listenToLaunchpadKnob: [1, 2],
            },
            staggerAmount: {
                type: MovingLinearParameter,
                range: [-8, 8],
                start: 0,
                monitorName: 'Stagger Amount',
                listenToDecrementAndIncrementLaunchpadButtons: 2,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_PITCH_BEND_MINUS, MixtrackButtons.L_PITCH_BEND_PLUS],
                variance: 0.5,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            mirrorStagger: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 1,
                listenToMixtrackButton: MixtrackButtons.L_EFFECT,
                monitorName: 'Mirror Stagger?',
            },
            roundStagger: {
                type: ToggleParameter,
                start: true,
                listenToLaunchpadButton: 0,
                monitorName: 'Round Stagger?',
            },
            riseDirection: {
                type: MovingLinearParameter,
                range: [-1, 1],
                start: 1,
                monitorName: 'Rise Dir',
                listenToLaunchpadKnob: [2, 3],
                variance: 0.04,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
            },
            sineDirection: {
                type: MovingLinearParameter,
                range: [-1, 1],
                start: 1,
                monitorName: 'Sine Dir',
                listenToLaunchpadKnob: [2, 4],
                variance: 0.04,
                autoupdateEveryNBeats: 4,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            sineAmplitude: {
                type: MovingLinearParameter,
                range: [0, 1],
                start: 0,
                monitorName: 'Sine Amp',
                listenToLaunchpadFader: [4, {addButtonStatusLight: true}],
                variance: 0.01,
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
            },
            sinePeriodTicks: {type: LogarithmicParameter,
                range: [4, 64],
                start: 16,
                listenToDecrementAndIncrementLaunchpadButtons: 4,
                monitorName: 'Sine Ticks',
            },
            blackout: {
                type: HoldButtonParameter,
                start: false,
                listenToLaunchpadButton: LaunchpadButtons.TRACK_FOCUS[5],
            },
            whiteout: {
                type: HoldButtonParameter,
                start: false,
                listenToLaunchpadButton: LaunchpadButtons.TRACK_CONTROL[5],
            },
        };
    }
    _incrementNumTicks() {
        this._riseNumTicks += this.riseDirection.getValue();
        this._sineNumTicks += this.sineDirection.getValue();
    }
    _getSineAmount(columnIndex) {
        const sineAmplitude = this.sineAmplitude.getValue();
        if (sineAmplitude === 0) {
            return 0;
        }
        const sinePeriodTicks = this.sinePeriodTicks.getValue();
        const sineWaveAngularOffsetPercent = (this._sineNumTicks + columnIndex) / sinePeriodTicks;
        return sineAmplitude * NUM_LEVELS * Math.sin(sineWaveAngularOffsetPercent * PI_TIMES_2);
    }
    _getRowIllumination(columnIndex, rowIndex) {
        const periodTicks = this.periodTicks.getValue();
        let staggerAmount = this.staggerAmount.getValue();
        if (this.roundStagger.getValue()) {
            staggerAmount = Math.round(staggerAmount);
        }
        if (staggerAmount !== 0) {
            if (this.mirrorStagger.getValue()) {
                columnIndex = posModAndBendToLowerHalf(columnIndex, NUM_TREES - 1);
            }
            rowIndex -= (columnIndex - NUM_TREES / 2) * staggerAmount;
        }
        const sineAmount = this._getSineAmount(columnIndex - NUM_TREES / 2);
        return posMod(this._riseNumTicks - rowIndex + sineAmount, periodTicks) / periodTicks;
    }
    _getColorShiftPerColumn() {
        return this.columnColorShift.getValue();
    }
    getColorForRowAndColumnAndPolygon(row, column, polygon) {
        const level = column * 4 + polygon.clockNumber;
        if (this.whiteout.getValue()) {
            return WHITE;
        } else if (this.blackout.getValue()) {
            return BLACK;
        }
        const color = tinycolor(this.baseColor.getValue().toHexString()); // clone
        const colorShiftPerColumn = this._getColorShiftPerColumn();
        const colorShiftPerRow = this.rowColorShift.getValue();
        const colorShift = colorShiftPerColumn * row + colorShiftPerRow * level;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        const baseRowIllumination = this._getRowIllumination(row, level);
        const revTrailPercent = 1 - this.revTrailPercent.getValue();
        let rowIllumination;
        if (baseRowIllumination > revTrailPercent || revTrailPercent === 0) {
            rowIllumination = arclerp(1, revTrailPercent, baseRowIllumination);
        } else {
            rowIllumination = arclerp(0, revTrailPercent, baseRowIllumination);
        }

        if (rowIllumination === 0) {
            return color;
        }
        const trailPercent = this.trailPercent.getValue();
        const defaultDarkenAmount = 50;
        const fullDarkenAmount = 65;
        let darkenAmount;
        if (trailPercent !== 0) {
            const trailedDarkenAmount = rowIllumination * fullDarkenAmount;
            darkenAmount = lerp(defaultDarkenAmount, trailedDarkenAmount, trailPercent);
        } else {
            darkenAmount = defaultDarkenAmount;
        }
        color.darken(darkenAmount);
        return color;
    }
}

module.exports = WallTreesParameters;
