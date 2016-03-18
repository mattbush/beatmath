var {LinearParameter, IntLinearParameter, MovingColorParameter, ToggleParameter} = require('js/core/parameters/Parameter');
var {mixboardFader, mixboardKnob, mixboardButton} = require('js/core/inputs/MixboardConstants');
var tinycolor = require('tinycolor2');
var {posMod, posModAndBendToLowerHalf, lerp} = require('js/core/utils/math');
const PieceParameters = require('js/core/parameters/PieceParameters');

class TreesParameters extends PieceParameters {
    constructor() {
        super(...arguments);

        this.levelColor = new MovingColorParameter({
            max: 5,
            variance: 1,
            start: tinycolor('#5ff'),
            autoupdate: 1000,
        });

        this.numTrees = new IntLinearParameter({
            min: 1,
            max: 16,
            start: 1,
        });
        this.numTrees.listenToFader(this._mixboard, mixboardFader.L_GAIN);

        this.numLevels = new IntLinearParameter({
            min: 1,
            max: 16,
            start: 1,
        });
        this.numLevels.listenToFader(this._mixboard, mixboardFader.R_GAIN);

        this.treeSpacing = new LinearParameter({
            min: 25,
            max: 500,
            start: 400,
        });
        this.treeSpacing.listenToKnob(this._mixboard, mixboardKnob.L_BASS);

        this.levelSpacing = new LinearParameter({
            min: 25,
            max: 500,
            start: 100,
        });
        this.levelSpacing.listenToKnob(this._mixboard, mixboardKnob.R_BASS);

        this.treeWidthPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.65,
        });
        this.treeWidthPercent.listenToKnob(this._mixboard, mixboardKnob.L_MID);

        this.levelHeightPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.65,
        });
        this.levelHeightPercent.listenToKnob(this._mixboard, mixboardKnob.R_MID);

        this.borderRadiusPercent = new LinearParameter({
            min: 0,
            max: 1,
            start: 0,
        });
        this.borderRadiusPercent.listenToKnob(this._mixboard, mixboardKnob.CUE_GAIN);

        this.periodTicksLog2 = new LinearParameter({
            min: 1,
            max: 4,
            start: 1,
        });
        this.periodTicksLog2.listenToIncrementButton(this._mixboard, mixboardButton.L_LOOP_RELOOP);
        this.periodTicksLog2.listenToDecrementButton(this._mixboard, mixboardButton.L_LOOP_OUT);
        this.periodTicksLog2.addStatusLight(this._mixboard, mixboardButton.L_LOOP_RELOOP, value => value % 2 === 0);
        this.periodTicksLog2.addStatusLight(this._mixboard, mixboardButton.L_LOOP_OUT, value => value > 2);

        this.treeColorShift = new LinearParameter({
            min: -60,
            max: 60,
            start: 0,
            incrementAmount: 2.5,
            monitorName: 'Tree color shift',
        });
        this.treeColorShift.listenToIncrementButton(this._mixboard, mixboardButton.L_HOT_CUE_1);
        this.treeColorShift.listenToDecrementButton(this._mixboard, mixboardButton.L_DELETE);
        this.treeColorShift.addStatusLight(this._mixboard, mixboardButton.L_HOT_CUE_1, value => value > 0);
        this.treeColorShift.addStatusLight(this._mixboard, mixboardButton.L_DELETE, value => value < 0);

        this.levelColorShift = new LinearParameter({
            min: -180,
            max: 180,
            start: 0,
            incrementAmount: 5,
            monitorName: 'Level color shift',
        });
        this.levelColorShift.listenToIncrementButton(this._mixboard, mixboardButton.L_HOT_CUE_3);
        this.levelColorShift.listenToDecrementButton(this._mixboard, mixboardButton.L_HOT_CUE_2);
        this.levelColorShift.addStatusLight(this._mixboard, mixboardButton.L_HOT_CUE_3, value => value > 0);
        this.levelColorShift.addStatusLight(this._mixboard, mixboardButton.L_HOT_CUE_2, value => value < 0);

        this.trailPercent = new LinearParameter({
            min: 0,
            max: 1.0,
            start: 0,
            incrementAmount: 0.05,
            monitorName: 'Trail percent',
        });
        this.trailPercent.listenToIncrementButton(this._mixboard, mixboardButton.L_LOOP_IN);
        this.trailPercent.listenToDecrementButton(this._mixboard, mixboardButton.L_LOOP_MANUAL);
        this.trailPercent.addStatusLight(this._mixboard, mixboardButton.L_LOOP_IN, value => value > 0);
        this.trailPercent.addStatusLight(this._mixboard, mixboardButton.L_LOOP_MANUAL, value => value >= 0.8);

        this.staggerAmount = new LinearParameter({
            min: 0,
            max: 8,
            start: 0,
            monitorName: 'Stagger Amount',
        });
        this.staggerAmount.listenToIncrementButton(this._mixboard, mixboardButton.L_PITCH_BEND_PLUS);
        this.staggerAmount.listenToDecrementButton(this._mixboard, mixboardButton.L_PITCH_BEND_MINUS);

        this.mirrorStagger = new ToggleParameter({
            start: false,
        });
        this.mirrorStagger.listenToButton(this._mixboard, mixboardButton.L_EFFECT);
        this.mirrorStagger.addStatusLight(this._mixboard, mixboardButton.L_EFFECT);
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
