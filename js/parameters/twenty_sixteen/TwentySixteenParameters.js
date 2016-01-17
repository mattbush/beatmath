var _ = require('underscore');
var {AngleParameter} = require('js/parameters/Parameter');
var {mixboardWheel, mixboardButton} = require('js/inputs/MixboardConstants');
var IndexMappingParameter = require('js/parameters/twenty_sixteen/IndexMappingParameter');

const ARRANGEMENTS = require('js/state/twenty_sixteen/arrangements');

const NUM_GOLD = 20;
const NUM_BLUE = 16;

class TwentySixteenParameters {
    constructor(mixboard) {
        this.arrangementIndex = new AngleParameter({
            start: 0,
            constrainTo: ARRANGEMENTS.length,
        });
        this.arrangementIndex.listenToWheel(mixboard, mixboardWheel.L_SELECT);

        mixboard.addButtonListener(mixboardButton.L_LOOP_MANUAL, this._incrementIndices.bind(this, -1));
        mixboard.addButtonListener(mixboardButton.L_LOOP_IN, this._incrementIndices.bind(this, 1));
        mixboard.addButtonListener(mixboardButton.L_LOOP_OUT, this._incrementIndices.bind(this, -1));
        mixboard.addButtonListener(mixboardButton.L_LOOP_RELOOP, this._incrementIndices.bind(this, 1));

        this.goldIndexMappings = _.times(NUM_GOLD, index => new IndexMappingParameter({start: index}));
        this.blueIndexMappings = _.times(NUM_BLUE, index => new IndexMappingParameter({start: index}));
    }
    _incrementIndices() {
        // TODO
    }
}

module.exports = TwentySixteenParameters;
