// var {LinearParameter} = require('js/parameters/Parameter');
// var {mixboardKnob} = require('js/inputs/MixboardConstants');
// const {NUM_COLS, NUM_ROWS, MAX_SIZE} = require('js/parameters/anagrams/AnagramsConstants');

class AnagramsParameters {
    constructor(mixboard) {
        this._mixboard = mixboard;
        // this.width = new LinearParameter({
        //     min: WIDTH_PX / 10,
        //     max: WIDTH_PX,
        //     start: WIDTH_PX,
        // });
        // this.width.listenToKnob(mixboard, mixboardKnob.CUE_MIX);

        // this.height = new LinearParameter({
        //     min: HEIGHT_PX / 10,
        //     max: HEIGHT_PX,
        //     start: DESIRED_HEIGHT_PX,
        // });
        // this.height.listenToKnob(mixboard, mixboardKnob.CUE_GAIN);
    }
}

module.exports = AnagramsParameters;
