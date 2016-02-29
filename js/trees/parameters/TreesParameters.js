var {LinearParameter, IntLinearParameter, MovingColorParameter} = require('js/core/parameters/Parameter');
var {mixboardFader, mixboardKnob, mixboardButton} = require('js/core/inputs/MixboardConstants');
var tinycolor = require('tinycolor2');

class TreesParameters {
    constructor(mixboard, beatmathParameters) {
        this._mixboard = mixboard; // todo
        this._beatmathParameters = beatmathParameters;

        this.levelColor = new MovingColorParameter({
            max: 5,
            variance: 1,
            start: tinycolor('#6ff'),
            autoupdate: 1000,
        });

        this.numTrees = new IntLinearParameter({
            min: 1,
            max: 8,
            start: 1,
        });
        this.numTrees.listenToFader(mixboard, mixboardFader.L_GAIN);

        this.numLevels = new IntLinearParameter({
            min: 1,
            max: 16,
            start: 1,
        });
        this.numLevels.listenToFader(mixboard, mixboardFader.R_GAIN);

        this.treeSpacing = new LinearParameter({
            min: 50,
            max: 800,
            start: 400,
        });
        this.treeSpacing.listenToKnob(mixboard, mixboardKnob.L_BASS);

        this.levelSpacing = new LinearParameter({
            min: 10,
            max: 200,
            start: 100,
        });
        this.levelSpacing.listenToKnob(mixboard, mixboardKnob.R_BASS);

        this.treeWidthPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.5,
        });
        this.treeWidthPercent.listenToKnob(mixboard, mixboardKnob.L_MID);

        this.levelHeightPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.5,
        });
        this.levelHeightPercent.listenToKnob(mixboard, mixboardKnob.R_MID);

        this.periodTicksLog2 = new LinearParameter({
            min: 1,
            max: 4,
            start: 1,
        });
        this.periodTicksLog2.listenToIncrementButton(mixboard, mixboardButton.L_LOOP_RELOOP);
        this.periodTicksLog2.listenToDecrementButton(mixboard, mixboardButton.L_LOOP_OUT);
        this.periodTicksLog2.addStatusLight(mixboard, mixboardButton.L_LOOP_RELOOP, value => value % 2 === 0);
        this.periodTicksLog2.addStatusLight(mixboard, mixboardButton.L_LOOP_OUT, value => value > 2);
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
    isLevelIlluminated(levelNumber) {
        var periodTicks = Math.pow(2, this.periodTicksLog2.getValue());
        var tempoNumTicks = this._beatmathParameters.tempo.getNumTicks();
        return levelNumber % periodTicks === tempoNumTicks % periodTicks;
    }
}

module.exports = TreesParameters;
