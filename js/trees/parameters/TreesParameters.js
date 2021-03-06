const {MovingLinearParameter, LogarithmicParameter, HoldButtonParameter, IntLinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs, MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {arclerp, clamp, modAndShiftToHalf} = require('js/core/utils/math');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const P = require('js/core/parameters/P');

const PI_TIMES_2 = Math.PI * 2;

const WHITE = tinycolor('#fff');
const BLACK = tinycolor('#000');

class TreesParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        super(...arguments);

        this._riseNumTicks = 0;
        this._sineNumTicks = 0;

        beatmathParameters.tempo.addListener(this._incrementNumTicks.bind(this));
    }
    _declareParameters() {
        return {
            ...P.BaseColor(),
            ...P.NumColumns({start: 16, max: 24}),
            ...P.NumRows({start: 16, max: 24}),
            columnWidth: {
                type: IntLinearParameter,
                range: [10, 200],
                start: 100,
                listenToLaunchpadKnob: [2, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Column Width',
            },
            rowHeight: {
                type: IntLinearParameter,
                range: [10, 200],
                start: 30,
                listenToLaunchpadKnob: [2, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Row Height',
            },
            columnGap: {type: IntLinearParameter,
                range: [0, 200],
                start: 30,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_MID,
                monitorName: 'Column Gap',
            },
            rowGap: {type: IntLinearParameter,
                range: [0, 200],
                start: 30,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_MID,
                monitorName: 'Row Gap',
            },
            ...P.BorderRadiusPercent(),
            periodTicks: {type: LogarithmicParameter,
                range: [2, 16],
                start: 2,
                listenToDecrementAndIncrementLaunchpadButtons: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                monitorName: 'Period Ticks',
            },
            ...P.ColumnColorShift({range: 180}),
            ...P.RowColorShift({range: 180}),
            ...P.CustomPercent({name: 'trailPercent', start: 0.5, inputPosition: [2, 2]}),
            ...P.CustomPercent({name: 'revTrailPercent', start: 0, inputPosition: [1, 2]}),
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
            ...P.CustomToggle({name: 'mirrorStagger', button: 1}),
            ...P.CustomToggle({name: 'roundStagger', button: 0, start: true}),
            polarGridAmount: {
                type: MovingLinearParameter,
                range: [-2, 3],
                start: 0.5, buildupStart: 0,
                incrementAmount: 0.05,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                monitorName: 'Polar Grid',
                variance: 0.15,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
                canSmoothUpdate: true,
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
    getColumnSpacing() {
        return this.columnWidth.getValue() + this.columnGap.getValue();
    }
    getRowSpacing() {
        return this.rowHeight.getValue() + this.rowGap.getValue();
    }
    getTotalColumnSpacing() {
        return this.getColumnSpacing() * this.numColumns.getValue();
    }
    getTotalRowSpacing() {
        return this.getRowSpacing() * this.numRows.getValue();
    }
    getColumnWidth() {
        return this.columnWidth.getValue();
    }
    getRowHeight() {
        return this.rowHeight.getValue();
    }
    _getAdjustedStaggerAmount(periodTicks, baseStaggerAmount, polarGridAmount) {
        const staggerAmountForAFullRotation = periodTicks / this.numColumns.getValue();
        const distanceFromClosestMultiple = modAndShiftToHalf(baseStaggerAmount, staggerAmountForAFullRotation);
        return baseStaggerAmount - (distanceFromClosestMultiple * polarGridAmount);
    }
    _getSineAmount(columnIndex) {
        const sineAmplitude = this.sineAmplitude.getValue();
        if (sineAmplitude === 0) {
            return 0;
        }
        const sinePeriodTicks = this.sinePeriodTicks.getValue();
        const sineWaveAngularOffsetPercent = (this._sineNumTicks + columnIndex) / sinePeriodTicks;
        return sineAmplitude * this.numRows.getValue() * Math.sin(sineWaveAngularOffsetPercent * PI_TIMES_2);
    }
    _getRowIllumination(columnIndex, rowIndex) {
        const periodTicks = this.periodTicks.getValue();
        let staggerAmount = this.staggerAmount.getValue();
        const polarGridAmount = clamp(this.polarGridAmount.getValue(), 0, 1);
        if (this.roundStagger.getValue()) {
            staggerAmount = Math.round(staggerAmount);
        } else if (polarGridAmount > 0) {
            staggerAmount = this._getAdjustedStaggerAmount(periodTicks, staggerAmount, polarGridAmount);
        }
        const numColumns = this.numColumns.getValue();
        if (staggerAmount !== 0) {
            if (this.mirrorStagger.getValue()) {
                columnIndex = posModAndBendToLowerHalf(columnIndex, numColumns - 1);
            }
            rowIndex -= (columnIndex - numColumns / 2) * staggerAmount;
        }
        const sineAmount = this._getSineAmount(columnIndex - numColumns / 2);
        return posMod(this._riseNumTicks - rowIndex + sineAmount, periodTicks) / periodTicks;
    }
    getBorderRadius() {
        return this.getRowHeight() * this.borderRadiusPercent.getValue() / 2;
    }
    _getColorShiftPerColumn() {
        const baseColorShift = this.columnColorShift.getValue();
        const polarGridAmount = clamp(this.polarGridAmount.getValue(), 0, 1);
        if (polarGridAmount === 0) {
            return baseColorShift;
        }
        const colorShiftForAFullRotation = 360 / this.numColumns.getValue();
        const distanceFromClosestMultiple = modAndShiftToHalf(baseColorShift, colorShiftForAFullRotation);
        return baseColorShift - (distanceFromClosestMultiple * polarGridAmount);
    }
    getColorForIndexAndRow(columnIndex, rowIndex) {
        if (this.whiteout.getValue()) {
            return WHITE;
        } else if (this.blackout.getValue()) {
            return BLACK;
        }
        const color = tinycolor(this.baseColor.getValue().toHexString()); // clone
        const colorShiftPerColumn = this._getColorShiftPerColumn();
        const colorShiftPerRow = this.rowColorShift.getValue();
        const colorShift = colorShiftPerColumn * columnIndex + colorShiftPerRow * rowIndex;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        const baseRowIllumination = this._getRowIllumination(columnIndex, rowIndex);
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

module.exports = TreesParameters;
