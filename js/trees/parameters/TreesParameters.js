const {MovingLinearParameter, LogarithmicParameter, LinearParameter, IntLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
const {MixtrackFaders, MixtrackKnobs, MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {arclerp, clamp, modAndShiftToHalf} = require('js/core/utils/math');

class TreesParameters extends PieceParameters {
    _declareParameters() {
        return {
            levelColor: {
                type: MovingColorParameter,
                start: tinycolor('#5ff'),
                max: 5,
                variance: 1,
                autoupdate: 1000,
            },
            numTrees: {
                type: IntLinearParameter,
                range: [1, 16],
                start: 16, mixboardStart: 1,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                listenToMixtrackFader: MixtrackFaders.L_GAIN,
                monitorName: '# Trees',
            },
            numLevels: {
                type: IntLinearParameter,
                range: [1, 24],
                start: 24, mixboardStart: 1,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                listenToMixtrackFader: MixtrackFaders.R_GAIN,
                monitorName: '# Levels',
            },
            treeWidth: {
                type: IntLinearParameter,
                range: [10, 200],
                start: 100,
                listenToLaunchpadKnob: [2, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Tree Width',
            },
            levelHeight: {
                type: IntLinearParameter,
                range: [10, 200],
                start: 30,
                listenToLaunchpadKnob: [2, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Level Height',
            },
            treeGap: {type: IntLinearParameter,
                range: [0, 200],
                start: 30,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_MID,
                monitorName: 'Tree Gap',
            },
            levelGap: {type: IntLinearParameter,
                range: [0, 200],
                start: 30,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_MID,
                monitorName: 'Level Gap',
            },
            borderRadiusPercent: {type: MovingLinearParameter,
                range: [0, 1],
                start: 0,
                listenToLaunchpadKnob: [0, 2],
                listenToMixtrackKnob: MixtrackKnobs.CUE_GAIN,
                variance: 0.01,
                monitorName: 'Roundness %',
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
            },
            periodTicks: {type: LogarithmicParameter,
                range: [2, 16],
                start: 2,
                listenToDecrementAndIncrementLaunchpadButtons: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                monitorName: 'Period Ticks',
            },
            treeColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Tree Color Shift',
                listenToLaunchpadKnob: [0, 0],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_DELETE, MixtrackButtons.L_HOT_CUE_1],
                variance: 5,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            levelColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Level Color Shift',
                listenToLaunchpadKnob: [0, 1],
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_HOT_CUE_2, MixtrackButtons.L_HOT_CUE_3],
                variance: 5,
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
            },
            trailPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5, mixboardStart: 0,
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
            polarGridAmount: {
                type: MovingLinearParameter,
                range: [-2, 3],
                start: 0.5, mixboardStart: 0,
                incrementAmount: 0.05,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                variance: 0.15,
                monitorName: 'Polar Grid',
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            riseDirection: {
                type: LinearParameter,
                range: [-1, 1],
                start: 1,
                monitorName: 'Rise Dir',
                listenToLaunchpadKnob: [2, 3],
            },
        };
    }
    getTreeSpacing() {
        return this.treeWidth.getValue() + this.treeGap.getValue();
    }
    getLevelSpacing() {
        return this.levelHeight.getValue() + this.levelGap.getValue();
    }
    getTotalTreeSpacing() {
        return this.getTreeSpacing() * this.numTrees.getValue();
    }
    getTotalLevelSpacing() {
        return this.getLevelSpacing() * this.numLevels.getValue();
    }
    getTreeWidth() {
        return this.treeWidth.getValue();
    }
    getLevelHeight() {
        return this.levelHeight.getValue();
    }
    _getAdjustedStaggerAmount(periodTicks, baseStaggerAmount, polarGridAmount) {
        const staggerAmountForAFullRotation = periodTicks / this.numTrees.getValue();
        const distanceFromClosestMultiple = modAndShiftToHalf(baseStaggerAmount, staggerAmountForAFullRotation);
        return baseStaggerAmount - (distanceFromClosestMultiple * polarGridAmount);
    }
    _getLevelIllumination(treeIndex, levelNumber) {
        const periodTicks = this.periodTicks.getValue();
        const tempoNumTicks = this._beatmathParameters.tempo.getNumTicks() * this.riseDirection.getValue();
        let staggerAmount = this.staggerAmount.getValue();
        const polarGridAmount = clamp(this.polarGridAmount.getValue(), 0, 1);
        if (this.roundStagger.getValue()) {
            staggerAmount = Math.round(staggerAmount);
        } else if (polarGridAmount > 0) {
            staggerAmount = this._getAdjustedStaggerAmount(periodTicks, staggerAmount, polarGridAmount);
        }
        if (staggerAmount !== 0) {
            if (this.mirrorStagger.getValue()) {
                treeIndex = posModAndBendToLowerHalf(treeIndex, this.numTrees.getValue() - 1);
            }
            levelNumber -= treeIndex * staggerAmount;
        }
        return posMod(tempoNumTicks - levelNumber, periodTicks) / periodTicks;
    }
    getBorderRadius() {
        return this.getLevelHeight() * this.borderRadiusPercent.getValue() / 2;
    }
    _getColorShiftPerTree() {
        const baseColorShift = this.treeColorShift.getValue();
        const polarGridAmount = clamp(this.polarGridAmount.getValue(), 0, 1);
        if (polarGridAmount === 0) {
            return baseColorShift;
        }
        const colorShiftForAFullRotation = 360 / this.numTrees.getValue();
        const distanceFromClosestMultiple = modAndShiftToHalf(baseColorShift, colorShiftForAFullRotation);
        return baseColorShift - (distanceFromClosestMultiple * polarGridAmount);
    }
    getColorForIndexAndLevel(treeIndex, levelNumber) {
        const color = tinycolor(this.levelColor.getValue().toHexString()); // clone
        const colorShiftPerTree = this._getColorShiftPerTree();
        const colorShiftPerLevel = this.levelColorShift.getValue();
        const colorShift = colorShiftPerTree * treeIndex + colorShiftPerLevel * levelNumber;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        const baseLevelIllumination = this._getLevelIllumination(treeIndex, levelNumber);
        const revTrailPercent = 1 - this.revTrailPercent.getValue();
        let levelIllumination;
        if (baseLevelIllumination > revTrailPercent || revTrailPercent === 0) {
            levelIllumination = arclerp(1, revTrailPercent, baseLevelIllumination);
        } else {
            levelIllumination = arclerp(0, revTrailPercent, baseLevelIllumination);
        }

        if (levelIllumination === 0) {
            return color;
        }
        const trailPercent = this.trailPercent.getValue();
        const defaultDarkenAmount = 50;
        const fullDarkenAmount = 65;
        let darkenAmount;
        if (trailPercent !== 0) {
            const trailedDarkenAmount = levelIllumination * fullDarkenAmount;
            darkenAmount = lerp(defaultDarkenAmount, trailedDarkenAmount, trailPercent);
        } else {
            darkenAmount = defaultDarkenAmount;
        }
        color.darken(darkenAmount);
        return color;
    }
}

module.exports = TreesParameters;
