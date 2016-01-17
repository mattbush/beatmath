var _ = require('underscore');
var {AngleParameter, ToggleParameter} = require('js/parameters/Parameter');
var {mixboardWheel, mixboardButton} = require('js/inputs/MixboardConstants');
var IndexMappingParameter = require('js/parameters/twenty_sixteen/IndexMappingParameter');

var {incrementGoldUp, incrementBlueUp, incrementGoldDown, incrementBlueDown} = require('js/state/twenty_sixteen/IndexMappingFunctions');

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

        this._reverseBlueIncrement = new ToggleParameter({
            start: 0,
            constrainTo: ARRANGEMENTS.length,
        });
        this._reverseBlueIncrement.listenToButton(mixboard, mixboardButton.L_KEYLOCK);

        mixboard.addButtonListener(mixboardButton.L_LOOP_MANUAL, this._incrementIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_IN, this._incrementIndicesUp.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_OUT, this._shiftIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_RELOOP, this._shiftIndicesUp.bind(this));

        this.goldIndexMappings = _.times(NUM_GOLD, index => new IndexMappingParameter({start: index}));
        this.blueIndexMappings = _.times(NUM_BLUE, index => new IndexMappingParameter({start: index}));
    }
    _incrementIndicesUp() {
        var reverseBlue = this._reverseBlueIncrement.getValue();
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldUp));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? incrementBlueDown : incrementBlueUp));
    }
    _incrementIndicesDown() {
        var reverseBlue = this._reverseBlueIncrement.getValue();
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldDown));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? incrementBlueUp : incrementBlueDown));
    }
    _shiftIndicesUp() {
        var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
        var reverseBlue = this._reverseBlueIncrement.getValue();
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldUp));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? arrangement.shiftBlueDown : arrangement.shiftBlueUp));
    }
    _shiftIndicesDown() {
        var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
        var reverseBlue = this._reverseBlueIncrement.getValue();
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldDown));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? arrangement.shiftBlueUp : arrangement.shiftBlueDown));
    }
}

module.exports = TwentySixteenParameters;
