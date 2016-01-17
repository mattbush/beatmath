var _ = require('underscore');
var {AngleParameter} = require('js/parameters/Parameter');
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

        mixboard.addButtonListener(mixboardButton.L_LOOP_MANUAL, this._incrementIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_IN, this._incrementIndicesUp.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_OUT, this._shiftIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_RELOOP, this._shiftIndicesUp.bind(this));

        this.goldIndexMappings = _.times(NUM_GOLD, index => new IndexMappingParameter({start: index}));
        this.blueIndexMappings = _.times(NUM_BLUE, index => new IndexMappingParameter({start: index}));
    }
    _incrementIndicesUp() {
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldUp));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(incrementBlueUp));
    }
    _incrementIndicesDown() {
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldDown));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(incrementBlueDown));
    }
    _shiftIndicesUp() {
        var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldUp));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(arrangement.shiftBlueUp));
    }
    _shiftIndicesDown() {
        var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
        _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldDown));
        _.map(this.blueIndexMappings, mapping => mapping.mapValue(arrangement.shiftBlueDown));
    }
}

module.exports = TwentySixteenParameters;
