var {LinearParameter} = require('js/parameters/Parameter');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants');
var {mixboardKnob} = require('js/inputs/MixboardConstants');

class BeatmathParameters {
    constructor(mixboard) {
        this.width = new LinearParameter({
            min: WIDTH_PX / 10,
            max: WIDTH_PX,
            start: WIDTH_PX,
        });
        this.width.listenToKnob(mixboard, mixboardKnob.CUE_MIX);

        this.height = new LinearParameter({
            min: HEIGHT_PX / 10,
            max: HEIGHT_PX,
            start: DESIRED_HEIGHT_PX,
        });
        this.height.listenToKnob(mixboard, mixboardKnob.CUE_GAIN);
    }
}

module.exports = BeatmathParameters;
