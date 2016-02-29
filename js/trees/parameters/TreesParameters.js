// var {LinearParameter, AngleParameter, CycleParameter, ToggleParameter} = require('js/core/parameters/Parameter');
// var {mixboardFader, mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');

class TreesParameters {
    constructor(mixboard, beatmathParameters) {
        this._mixboard = mixboard; // todo
        this._beatmathParameters = beatmathParameters;
    }
}

module.exports = TreesParameters;
