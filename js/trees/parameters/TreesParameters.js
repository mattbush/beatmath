var {LinearParameter, MovingColorParameter} = require('js/core/parameters/Parameter');
// var {mixboardFader, mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');
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

        this.numTrees = new LinearParameter({
            min: 1,
            max: 8,
            start: 1,
        });

        this.numLevels = new LinearParameter({
            min: 1,
            max: 16,
            start: 1,
        });

        this.treeSpacing = new LinearParameter({
            min: 50,
            max: 800,
            start: 400,
        });

        this.levelSpacing = new LinearParameter({
            min: 10,
            max: 200,
            start: 100,
        });

        this.treeWidthPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.5,
        });

        this.levelHeightPercent = new LinearParameter({
            min: 0.25,
            max: 1,
            start: 0.5,
        });

        this.periodTicksLog2 = new LinearParameter({
            min: 1,
            max: 4,
            start: 1,
        });
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
