var {AngleParameter} = require('js/parameters/Parameter');
var {mixboardWheel} = require('js/inputs/MixboardConstants');

const ARRANGEMENTS = require('js/state/twenty_sixteen/arrangements');

class TwentySixteenParameters {
    constructor(mixboard) {
        this.arrangementIndex = new AngleParameter({
            start: 0,
            constrainTo: ARRANGEMENTS.length,
        });
        this.arrangementIndex.listenToWheel(mixboard, mixboardWheel.L_SELECT);
    }
}

module.exports = TwentySixteenParameters;
