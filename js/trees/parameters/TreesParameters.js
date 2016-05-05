var {MovingLinearParameter, LinearParameter, IntLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
var {MixtrackFaders, MixtrackKnobs, MixtrackButtons, MixtrackWheels} = require('js/core/inputs/MixtrackConstants');
var tinycolor = require('tinycolor2');
var {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
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
                listenToFader: MixtrackFaders.L_GAIN,
            },
            numLevels: {
                type: IntLinearParameter,
                range: [1, 24],
                start: 24, mixboardStart: 1,
                listenToFader: MixtrackFaders.R_GAIN,
            },
            treeSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 400,
                listenToKnob: MixtrackKnobs.L_BASS,
            },
            levelSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 100,
                listenToKnob: MixtrackKnobs.R_BASS,
            },
            treeWidthPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToKnob: MixtrackKnobs.L_MID,
            },
            levelHeightPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToKnob: MixtrackKnobs.R_MID,
            },
            borderRadiusPercent: {type: MovingLinearParameter,
                range: [0, 1],
                start: 0,
                listenToKnob: MixtrackKnobs.CUE_GAIN,
                variance: 0.01,
                monitorName: 'Border Radius Percent',
                autoupdateEveryNBeats: 2,
                autoupdateOnCue: true,
            },
            periodTicksLog2: {type: LinearParameter,
                range: [1, 4],
                start: 3,
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
            },
            treeColorShift: {
                type: LinearParameter,
                range: [-180, 180],
                start: 0, // or 360 / 16,
                incrementAmount: 2.5,
                monitorName: 'Tree color shift',
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_DELETE, MixtrackButtons.L_HOT_CUE_1],
            },
            levelColorShift: {
                type: MovingLinearParameter,
                range: [-180, 180],
                start: 360 / 16,
                incrementAmount: 2.5,
                monitorName: 'Level color shift',
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_HOT_CUE_2, MixtrackButtons.L_HOT_CUE_3],
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
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_LOOP_MANUAL, MixtrackButtons.L_LOOP_IN],
            },
            staggerAmount: {
                type: MovingLinearParameter,
                range: [-8, 8],
                start: 0,
                monitorName: 'Stagger Amount',
                listenToDecrementAndIncrementButtons: [MixtrackButtons.L_PITCH_BEND_MINUS, MixtrackButtons.L_PITCH_BEND_PLUS],
                variance: 1.5,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            mirrorStagger: {
                type: ToggleParameter,
                start: false,
                listenToButton: MixtrackButtons.L_EFFECT,
            },
            polarGridAmount: {
                type: MovingLinearParameter,
                range: [-2, 3],
                start: 0.5,
                incrementAmount: 0.05,
                listenToWheel: MixtrackWheels.R_CONTROL_2,
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
        var periodTicks = Math.pow(2, this.periodTicksLog2.getValue());
        var tempoNumTicks = this._beatmathParameters.tempo.getNumTicks();
        var staggerAmount = Math.round(this.staggerAmount.getValue());
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
        var color = tinycolor(this.levelColor.getValue().toHexString()); // clone
        var colorShiftPerTree = this.treeColorShift.getValue();
        var colorShiftPerLevel = this.levelColorShift.getValue();
        var colorShift = colorShiftPerTree * treeIndex + colorShiftPerLevel * levelNumber;
        if (colorShift !== 0) {
            color.spin(colorShift);
        }
        var levelIllumination = this._getLevelIllumination(treeIndex, levelNumber);
        if (levelIllumination === 0) {
            return color;
        }
        var trailPercent = this.trailPercent.getValue();
        var defaultDarkenAmount = 50;
        var fullDarkenAmount = 65;
        var darkenAmount;
        if (trailPercent !== 0) {
            var trailedDarkenAmount = levelIllumination * fullDarkenAmount;
            darkenAmount = lerp(defaultDarkenAmount, trailedDarkenAmount, trailPercent);
        } else {
            darkenAmount = defaultDarkenAmount;
        }
        color.darken(darkenAmount);
        return color;
    }
}

module.exports = TreesParameters;
