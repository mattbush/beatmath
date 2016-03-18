var {LinearParameter, IntLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
var {mixboardFader, mixboardKnob, mixboardButton} = require('js/core/inputs/MixboardConstants');
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
                start: 1,
                range: [1, 16],
                listenToFader: mixboardFader.L_GAIN,
            },
            numLevels: {
                type: IntLinearParameter,
                range: [1, 16],
                start: 1,
                listenToFader: mixboardFader.R_GAIN,
            },
            treeSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 400,
                listenToKnob: mixboardKnob.L_BASS,
            },
            levelSpacing: {
                type: IntLinearParameter,
                range: [25, 500],
                start: 100,
                listenToKnob: mixboardKnob.R_BASS,
            },
            treeWidthPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToKnob: mixboardKnob.L_MID,
            },
            levelHeightPercent: {type: LinearParameter,
                range: [0.25, 1],
                start: 0.65,
                listenToKnob: mixboardKnob.R_MID,
            },
            borderRadiusPercent: {type: LinearParameter,
                range: [0, 1],
                start: 0,
                listenToKnob: mixboardKnob.CUE_GAIN,
            },
            periodTicksLog2: {type: LinearParameter,
                range: [1, 4],
                start: 1,
                listenToIncrementButton: mixboardButton.L_LOOP_RELOOP,
                listenToDecrementButton: mixboardButton.L_LOOP_OUT,
                addStatusLight1: [mixboardButton.L_LOOP_RELOOP, value => value % 2 === 0],
                addStatusLight2: [mixboardButton.L_LOOP_OUT, value => value > 2],
            },
            treeColorShift: {type: LinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Tree color shift',
                listenToIncrementButton: mixboardButton.L_HOT_CUE_1,
                listenToDecrementButton: mixboardButton.L_DELETE,
                addStatusLight1: [mixboardButton.L_HOT_CUE_1, value => value > 0],
                addStatusLight2: [mixboardButton.L_DELETE, value => value < 0],
            },
            levelColorShift: {
                type: LinearParameter,
                range: [-180, 180],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Level color shift',
                listenToIncrementButton: mixboardButton.L_HOT_CUE_3,
                listenToDecrementButton: mixboardButton.L_HOT_CUE_2,
                addStatusLight1: [mixboardButton.L_HOT_CUE_3, value => value > 0],
                addStatusLight2: [mixboardButton.L_HOT_CUE_2, value => value < 0],
            },
            trailPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 0,
                incrementAmount: 0.05,
                monitorName: 'Trail percent',
                listenToIncrementButton: mixboardButton.L_LOOP_IN,
                listenToDecrementButton: mixboardButton.L_LOOP_MANUAL,
                addStatusLight1: [mixboardButton.L_LOOP_IN, value => value > 0],
                addStatusLight2: [mixboardButton.L_LOOP_MANUAL, value => value >= 0.8],
            },
            staggerAmount: {
                type: LinearParameter,
                range: [0, 8],
                start: 0,
                monitorName: 'Stagger Amount',
                listenToIncrementButton: mixboardButton.L_PITCH_BEND_PLUS,
                listenToDecrementButton: mixboardButton.L_PITCH_BEND_MINUS,
            },
            mirrorStagger: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.L_EFFECT,
                addStatusLight: [mixboardButton.L_EFFECT],
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
        if (this.staggerAmount.getValue() > 0) {
            if (this.mirrorStagger.getValue()) {
                treeIndex = posModAndBendToLowerHalf(treeIndex, this.numTrees.getValue() - 1);
            }
            levelNumber -= treeIndex * this.staggerAmount.getValue();
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
