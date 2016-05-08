const {MovingLinearParameter, LinearParameter, IntLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
const {MixtrackFaders, MixtrackKnobs, MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');

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
                listenToMixtrackFader: MixtrackFaders.L_GAIN,
            },
            numLevels: {
                type: IntLinearParameter,
                range: [1, 24],
                start: 24, mixboardStart: 1,
                listenToMixtrackFader: MixtrackFaders.R_GAIN,
            },
            treeSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 400,
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
            },
            levelSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 100,
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
            },
            treeWidthPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToMixtrackKnob: MixtrackKnobs.L_MID,
            },
            levelHeightPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToMixtrackKnob: MixtrackKnobs.R_MID,
            },
            borderRadiusPercent: {type: MovingLinearParameter,
                range: [0, 1],
                start: 0,
                listenToMixtrackKnob: MixtrackKnobs.CUE_GAIN,
                variance: 0.01,
                monitorName: 'Border Radius Percent',
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
            },
            periodTicksLog2: {type: LinearParameter,
                range: [1, 4],
                start: 3,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
            },
            treeColorShift: {
                type: LinearParameter,
                range: [-180, 180],
                start: 0, // or 360 / 16,
                incrementAmount: 2.5,
                monitorName: 'Tree color shift',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_DELETE, MixtrackButtons.L_HOT_CUE_1],
            },
            levelColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 360 / 16,
                incrementAmount: 2.5,
                monitorName: 'Level color shift',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_HOT_CUE_2, MixtrackButtons.L_HOT_CUE_3],
                variance: 5,
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
            },
            trailPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0.5,
                incrementAmount: 0.05,
                monitorName: 'Trail percent',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
            },
            staggerAmount: {
                type: MovingLinearParameter,
                range: [-8, 8],
                start: 0,
                monitorName: 'Stagger Amount',
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_PITCH_BEND_MINUS, MixtrackButtons.L_PITCH_BEND_PLUS],
                variance: 1.5,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            mirrorStagger: {
                type: ToggleParameter,
                start: false,
                listenToMixtrackButton: MixtrackButtons.L_EFFECT,
            },
            polarGridAmount: {
                type: MovingLinearParameter,
                range: [-2, 3],
                start: 0.5,
                incrementAmount: 0.05,
                listenToMixtrackWheel: MixtrackWheels.R_CONTROL_2,
                variance: 0.15,
                monitorName: 'Polar Grid Amount',
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
        };
    }
    getTotalTreeSpacing() {
        return this.treeSpacing.getValue() * this.numTrees.getValue();
    }
    getTotalLevelSpacing() {
        return this.levelSpacing.getValue() * this.numLevels.getValue();
    }
    getTreeWidth() {
        return this.treeSpacing.getValue() * this.treeWidthPercent.getValue();
    }
    getLevelHeight() {
        return this.levelSpacing.getValue() * this.levelHeightPercent.getValue();
    }
    _getLevelIllumination(treeIndex, levelNumber) {
        const periodTicks = Math.pow(2, this.periodTicksLog2.getValue());
        const tempoNumTicks = this._beatmathParameters.tempo.getNumTicks();
        const staggerAmount = Math.round(this.staggerAmount.getValue());
        if (staggerAmount !== 0) {
            if (this.mirrorStagger.getValue()) {
                treeIndex = posModAndBendToLowerHalf(treeIndex, this.numTrees.getValue() - 1);
            }
            levelNumber -= treeIndex * staggerAmount;
        }
        return posMod(tempoNumTicks - levelNumber, periodTicks) / (periodTicks - 1);
    }
    getBorderRadius() {
        return this.getLevelHeight() * this.borderRadiusPercent.getValue() / 2;
    }
    getColorForIndexAndLevel(treeIndex, levelNumber) {
        const color = tinycolor(this.levelColor.getValue().toHexString()); // clone
        const colorShiftPerTree = this.treeColorShift.getValue();
        const colorShiftPerLevel = this.levelColorShift.getValue();
        const colorShift = colorShiftPerTree * treeIndex + colorShiftPerLevel * levelNumber;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        const levelIllumination = this._getLevelIllumination(treeIndex, levelNumber);
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
