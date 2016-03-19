var _ = require('underscore');
var {AngleParameter, ToggleParameter, MovingColorParameter, LinearParameter} = require('js/core/parameters/Parameter');
var {mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');
var IndexMappingParameter = require('js/twenty_sixteen/parameters/IndexMappingParameter');
var tinycolor = require('tinycolor2');
var {posMod} = require('js/core/utils/math');
var {setTimeoutAsync} = require('js/core/utils/time');
var updateHue = require('js/core/outputs/updateHue');
const PieceParameters = require('js/core/parameters/PieceParameters');

var {incrementGoldUp, incrementBlueUp, incrementGoldDown, incrementBlueDown} = require('js/twenty_sixteen/state/IndexMappingFunctions');

var SAT_COEFF = 1.5;
var BRI_COEFF = 0.6;
var HUE_COEFFS = {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF};

const ARRANGEMENTS = require('js/twenty_sixteen/state/arrangements');

const SET_ARRANGEMENT_BUTTONS = [mixboardButton.L_HOT_CUE_1, mixboardButton.L_HOT_CUE_2, mixboardButton.L_HOT_CUE_3];
const NUM_PRESET_ARRANGEMENTS = SET_ARRANGEMENT_BUTTONS.length;

const NUM_GOLD = 20;
const NUM_BLUE = 16;

const ENABLE_HUE = false;

const AUTOPILOT_FREQ_MAX = 5;

class TwentySixteenParameters extends PieceParameters {
    _declareParameters() {
        return {
            arrangementIndex: {
                type: AngleParameter,
                start: 0,
                constrainTo: ARRANGEMENTS.length,
                monitorName: 'Arrangement #',
                listenToWheel: mixboardWheel.BROWSE,
            },
            goldColor: {
                type: MovingColorParameter,
                max: 5,
                variance: 1,
                start: tinycolor('#f90'),
                autoupdate: 1000,
            },
            _reverseBlueIncrement: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.L_KEYLOCK,
            },
            _isAutopiloting: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.L_EFFECT,
            },
            _autopilotArrangementFrequencyLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 2,
                listenToWheel: mixboardWheel.L_SELECT,
            },
            _autopilotIncrementFrequencyLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: AUTOPILOT_FREQ_MAX,
                listenToWheel: mixboardWheel.L_CONTROL_1,
            },
            _autopilotShiftFrequencyLog2: {
                type: LinearParameter,
                range: [0, AUTOPILOT_FREQ_MAX],
                start: 0,
                listenToWheel: mixboardWheel.L_CONTROL_2,
            },
            reverseFrameRotationInPixels: {
                type: ToggleParameter,
                start: false,
                listenToButton: mixboardButton.R_KEYLOCK,
            },
        };
    }
    constructor() {
        super(...arguments);
        this._onTickForAutopilot = this._onTickForAutopilot.bind(this);
        this._beatmathParameters.tempo.addListener(this._onTickForAutopilot);

        this._isAutopiloting.addListener(this._onAutopilotChange.bind(this));

        this._resetArrangements(true);
        this._mixboard.addButtonListener(mixboardButton.L_DELETE, this._resetArrangements.bind(this));
        _.times(NUM_PRESET_ARRANGEMENTS, index => {
            this._mixboard.addButtonListener(SET_ARRANGEMENT_BUTTONS[index], this._setArrangement.bind(this, index));
        });

        this._mixboard.addButtonListener(mixboardButton.L_LOOP_MANUAL, this._incrementIndicesDown.bind(this));
        this._mixboard.addButtonListener(mixboardButton.L_LOOP_IN, this._incrementIndicesUp.bind(this));
        this._mixboard.addButtonListener(mixboardButton.L_LOOP_OUT, this._shiftIndicesDown.bind(this));
        this._mixboard.addButtonListener(mixboardButton.L_LOOP_RELOOP, this._shiftIndicesUp.bind(this));

        this.goldIndexMappings = _.times(NUM_GOLD, index => new IndexMappingParameter({start: index}));
        this.blueIndexMappings = _.times(NUM_BLUE, index => new IndexMappingParameter({start: index}));
    }
    _resetArrangements(inputValue) {
        if (inputValue && !this._isOnAutopilot()) {
            this._arrangements = _.times(NUM_PRESET_ARRANGEMENTS, _.noop);
            _.times(NUM_PRESET_ARRANGEMENTS, index => {
                this._mixboard.toggleLight(SET_ARRANGEMENT_BUTTONS[index], false);
            });
        }
    }
    _setArrangement(index, inputValue) {
        if (inputValue && !this._isOnAutopilot()) {
            this._arrangements[index] = this.arrangementIndex.getValue();
            this._mixboard.toggleLight(SET_ARRANGEMENT_BUTTONS[index], true);
        }
    }
    _incrementIndicesUp(value) {
        if (value) {
            var reverseBlue = this._reverseBlueIncrement.getValue();
            _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldUp));
            _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? incrementBlueDown : incrementBlueUp));
        }
    }
    _incrementIndicesDown(value) {
        if (value) {
            var reverseBlue = this._reverseBlueIncrement.getValue();
            _.map(this.goldIndexMappings, mapping => mapping.mapValue(incrementGoldDown));
            _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? incrementBlueUp : incrementBlueDown));
        }
    }
    _shiftIndicesUp(value) {
        if (value) {
            var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
            var reverseBlue = this._reverseBlueIncrement.getValue();
            _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldUp));
            _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? arrangement.shiftBlueDown : arrangement.shiftBlueUp));
        }
    }
    _shiftIndicesDown(value) {
        if (value) {
            var arrangement = ARRANGEMENTS[this.arrangementIndex.getValue()];
            var reverseBlue = this._reverseBlueIncrement.getValue();
            _.map(this.goldIndexMappings, mapping => mapping.mapValue(arrangement.shiftGoldDown));
            _.map(this.blueIndexMappings, mapping => mapping.mapValue(reverseBlue ? arrangement.shiftBlueUp : arrangement.shiftBlueDown));
        }
    }
    async _updateLightForAutopilot(eventCode) {
        var period = this._beatmathParameters.tempo.getPeriod();

        this._mixboard.toggleLight(eventCode, true);
        await setTimeoutAsync(period / 2);
        this._mixboard.toggleLight(eventCode, false);
    }
    _onAutopilotChange() {
        if (this._isOnAutopilot()) {
            if (this._arrangements[0] !== undefined && this._arrangements[1] !== undefined) {
                this._autopilotIndex = 0;
            } else {
                this._isAutopiloting._value = false;
                this._isAutopiloting._updateListeners();
            }
        }
    }
    _isOnAutopilot() {
        return this._isAutopiloting.getValue();
    }
    _onTickForAutopilot() {
        var ticks = this._beatmathParameters.tempo.getNumTicks();

        var arrangementFreq = this._autopilotArrangementFrequencyLog2.getValue();
        var incrementFreq = this._autopilotIncrementFrequencyLog2.getValue();
        var shiftFreq = this._autopilotShiftFrequencyLog2.getValue();

        if (arrangementFreq !== AUTOPILOT_FREQ_MAX && ticks % Math.pow(2, arrangementFreq) === 0) {
            if (this._isOnAutopilot()) {
                do {
                    this._autopilotIndex = posMod(this._autopilotIndex + 1, this._arrangements.length);
                } while (this._arrangements[this._autopilotIndex] === undefined);
                this.arrangementIndex._value = this._arrangements[this._autopilotIndex];
                this.arrangementIndex._updateListeners();
            }
            this._updateLightForAutopilot(mixboardButton.L_DELETE);

        } else if (incrementFreq !== AUTOPILOT_FREQ_MAX && ticks % Math.pow(2, incrementFreq) === 0) {
            if (this._isOnAutopilot()) {
                this._incrementIndicesUp(true);
            }
            this._updateLightForAutopilot(mixboardButton.L_LOOP_IN);

        } else if (shiftFreq !== AUTOPILOT_FREQ_MAX && ticks % Math.pow(2, shiftFreq) === 0) {
            if (this._isOnAutopilot()) {
                this._shiftIndicesUp(true);
            }
            this._updateLightForAutopilot(mixboardButton.L_LOOP_RELOOP);
        }

        if (ENABLE_HUE) {
            var goldColor = tinycolor(this.goldColor.getValue().toHexString()); // clone
            var blueColor = tinycolor(goldColor.toHexString()).spin(180); // clone

            if (ticks % 2) {
                updateHue(posMod(ticks, 3), goldColor, HUE_COEFFS);
            } else {
                updateHue(posMod(ticks, 3), blueColor, HUE_COEFFS);
            }
        }
    }
}

module.exports = TwentySixteenParameters;
