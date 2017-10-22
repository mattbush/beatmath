const _ = require('lodash');
const {MovingLinearParameter, LogarithmicParameter, HoldButtonParameter} = require('js/core/parameters/Parameter');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {arclerp} = require('js/core/utils/math');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const P = require('js/core/parameters/P');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const {NUM_LIGHTS} = require('js/hue_constants');

const NUM_TREES = 15;
const NUM_LEVELS = 8;

const PI_TIMES_2 = Math.PI * 2;

const WHITE = tinycolor('#fff');
const BLACK = tinycolor('#000');

class WallCircuitParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters) {
        super(...arguments);

        this._riseNumTicks = 0;
        this._sineNumTicks = 0;

        beatmathParameters.tempo.addListener(this._incrementNumTicks.bind(this));

        if (ENABLE_HUE) {
            _.times(NUM_LIGHTS, lightNumber => {
                updateHue(lightNumber, tinycolor('#000'));
            });
        }
    }
    _declareParameters() {
        return {
            ...P.BaseColor(),
            periodTicks: {type: LogarithmicParameter,
                range: [2, 16],
                start: 2,
                listenToDecrementAndIncrementLaunchpadButtons: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                monitorName: 'Period Ticks',
            },
            ...P.ColumnColorShift({range: 45}),
            ...P.RowColorShift({range: 45}),
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
                columnIndex = posModAndBendToLowerHalf(columnIndex, (NUM_TREES / 2.5));
            }
            rowIndex -= (columnIndex - NUM_TREES / 2) * staggerAmount;
        }
        const sineAmount = this._getSineAmount(columnIndex - NUM_TREES / 2);
        return posMod(this._riseNumTicks - rowIndex + sineAmount, periodTicks) / periodTicks;
    }
    _getColorShiftPerColumn() {
        return this.columnColorShift.getValue();
    }
    getColorForColumnAndRow(column, row) {
        if (this.whiteout.getValue()) {
            return WHITE;
        } else if (this.blackout.getValue()) {
            return BLACK;
        }
        const color = tinycolor(this.baseColor.getValue().toHexString()); // clone
        const colorShiftPerColumn = this._getColorShiftPerColumn();
        const colorShiftPerRow = this.rowColorShift.getValue();
        const colorShift = colorShiftPerColumn * column + colorShiftPerRow * row;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        const baseRowIllumination = this._getRowIllumination(column, row);
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

module.exports = WallCircuitParameters;
