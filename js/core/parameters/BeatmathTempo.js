var _ = require('underscore');
var {posMod} = require('js/core/utils/math');
var {mixboardButton} = require('js/core/inputs/MixboardConstants');
var {R_SYNC: BUTTON_1, R_CUE: BUTTON_2, R_PLAY_PAUSE: BUTTON_3, R_STUTTER: BUTTON_4} = mixboardButton;

var MS_PER_MINUTE = 60000;

const LIGHT_EVENTS = [BUTTON_1, BUTTON_2, BUTTON_3, BUTTON_4];
const NUM_LIGHTS = LIGHT_EVENTS.length;

class BeatmathTempo {
    constructor(mixboard, params) {
        this._mixboard = mixboard;
        this._bpm = params.bpm;
        this._period = MS_PER_MINUTE / params.bpm;
        this._numTicks = -1;
        this._nextTick = Date.now() + this._period;
        this._tick = this._tick.bind(this);
        setInterval(this._tick, this._period);

        _.times(NUM_LIGHTS, lightNum => mixboard.toggleLight(LIGHT_EVENTS[lightNum], false));
    }
    _tick() {
        this._nextTick += this._period;
        this._numTicks++;
        this._updateLights();
    }
    getPeriod() {
        return this._period;
    }
    getNextTick() {
        return this._nextTick;
    }
    getNumTicks() {
        return this._numTicks;
    }
    _updateLights() {
        var lightToTurnOff = posMod(this._numTicks - 1, NUM_LIGHTS);
        var lightToTurnOn = posMod(this._numTicks, NUM_LIGHTS);
        this._mixboard.toggleLight(LIGHT_EVENTS[lightToTurnOff], false);
        this._mixboard.toggleLight(LIGHT_EVENTS[lightToTurnOn], true);
    }
}

module.exports = BeatmathTempo;
