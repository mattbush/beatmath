var _ = require('underscore');
var {AngleParameter, ToggleParameter, MovingColorParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');
var IndexMappingParameter = require('js/twenty_sixteen/parameters/IndexMappingParameter');
var tinycolor = require('tinycolor2');
var {posMod} = require('js/core/utils/math');

var {incrementGoldUp, incrementBlueUp, incrementGoldDown, incrementBlueDown} = require('js/twenty_sixteen/state/IndexMappingFunctions');

const ARRANGEMENTS = require('js/twenty_sixteen/state/arrangements');

const BPM = 126.4;

const NUM_GOLD = 20;
const NUM_BLUE = 16;

const AUTOPILOT_FREQ_MAX = 5;

class TwentySixteenParameters {
    constructor(mixboard) {
        this._doAutopilotUpdate = this._doAutopilotUpdate.bind(this);

        this.arrangementIndex = new AngleParameter({
            start: 0,
            constrainTo: ARRANGEMENTS.length,
        });
        this.arrangementIndex.listenToWheel(mixboard, mixboardWheel.BROWSE);

        this.goldColor = new MovingColorParameter({
            max: 5,
            variance: 1,
            start: tinycolor('#f90'),
            autoupdate: 1000,
        });

        this._reverseBlueIncrement = new ToggleParameter({
            start: false,
        });
        this._reverseBlueIncrement.listenToButton(mixboard, mixboardButton.L_KEYLOCK);

        this._isAutopiloting = new ToggleParameter({
            start: false,
        });
        this._isAutopiloting.listenToButton(mixboard, mixboardButton.L_EFFECT);
        this._isAutopiloting.addListener(this._onAutopilotChange.bind(this));

        this._autopilotArrangementFrequencyLog2 = new LinearParameter({
            min: 0,
            start: 2,
            max: AUTOPILOT_FREQ_MAX,
        });
        this._autopilotArrangementFrequencyLog2.listenToWheel(mixboard, mixboardWheel.L_SELECT);
        this._autopilotIncrementFrequencyLog2 = new LinearParameter({
            min: 0,
            start: AUTOPILOT_FREQ_MAX,
            max: AUTOPILOT_FREQ_MAX,
        });
        this._autopilotIncrementFrequencyLog2.listenToWheel(mixboard, mixboardWheel.L_CONTROL_1);
        this._autopilotShiftFrequencyLog2 = new LinearParameter({
            min: 0,
            start: 0,
            max: AUTOPILOT_FREQ_MAX,
        });
        this._autopilotShiftFrequencyLog2.listenToWheel(mixboard, mixboardWheel.L_CONTROL_2);

        this._arrangements = [undefined, undefined, undefined];
        mixboard.addButtonListener(mixboardButton.L_DELETE, this._resetArrangements.bind(this));
        mixboard.addButtonListener(mixboardButton.L_HOT_CUE_1, this._setArrangement.bind(this, 0));
        mixboard.addButtonListener(mixboardButton.L_HOT_CUE_2, this._setArrangement.bind(this, 1));
        mixboard.addButtonListener(mixboardButton.L_HOT_CUE_3, this._setArrangement.bind(this, 2));

        mixboard.addButtonListener(mixboardButton.L_LOOP_MANUAL, this._incrementIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_IN, this._incrementIndicesUp.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_OUT, this._shiftIndicesDown.bind(this));
        mixboard.addButtonListener(mixboardButton.L_LOOP_RELOOP, this._shiftIndicesUp.bind(this));

        this.goldIndexMappings = _.times(NUM_GOLD, index => new IndexMappingParameter({start: index}));
        this.blueIndexMappings = _.times(NUM_BLUE, index => new IndexMappingParameter({start: index}));
    }
    _resetArrangements(inputValue) {
        if (inputValue && !this._isAutopiloting.getValue()) {
            this._arrangements = [undefined, undefined, undefined];
        }
    }
    _setArrangement(index, inputValue) {
        if (inputValue && !this._isAutopiloting.getValue()) {
            this._arrangements[index] = this.arrangementIndex.getValue();
        }
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
    _onAutopilotChange() {
        if (this._isAutopiloting.getValue()) {
            if (this._arrangements[0] === undefined && this._arrangements[1] === undefined) {
                return;
            }

            this._ticks = 0;
            this._autopilotIndex = 0;
            this._doAutopilotUpdate();
        } else {
            clearTimeout(this._autopilotTimeout);
        }
    }
    _doAutopilotUpdate() {
        this._autopilotTimeout = setTimeout(this._doAutopilotUpdate, 1000 * 60 / BPM);

        var arrangementFreq = this._autopilotArrangementFrequencyLog2.getValue();
        var incrementFreq = this._autopilotIncrementFrequencyLog2.getValue();
        var shiftFreq = this._autopilotShiftFrequencyLog2.getValue();

        if (arrangementFreq !== AUTOPILOT_FREQ_MAX && this._ticks % Math.pow(2, arrangementFreq) === 0) {
            do {
                this._autopilotIndex = posMod(this._autopilotIndex + 1, this._arrangements.length);
            } while (this._arrangements[this._autopilotIndex] === undefined);
            this.arrangementIndex._value = this._arrangements[this._autopilotIndex];
            this.arrangementIndex._updateListeners();

        } else if (incrementFreq !== AUTOPILOT_FREQ_MAX && this._ticks % Math.pow(2, incrementFreq) === 0) {
            this._incrementIndicesUp();

        } else if (shiftFreq !== AUTOPILOT_FREQ_MAX && this._ticks % Math.pow(2, shiftFreq) === 0) {
            this._shiftIndicesUp();
        }

        this._ticks++;
    }
}

module.exports = TwentySixteenParameters;
