const _ = require('underscore');
const {posMod} = require('js/core/utils/math');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {runAtTimestamp} = require('js/core/utils/time');
const {
    R_SYNC: BUTTON_1,
    R_CUE: BUTTON_2,
    R_PLAY_PAUSE: BUTTON_3,
    R_STUTTER: BUTTON_4,
    R_SCRATCH: MOD_BUTTON,
} = MixtrackButtons;

const MS_PER_MINUTE = 60000;

const LIGHT_EVENTS = [BUTTON_1, BUTTON_2, BUTTON_3, BUTTON_4];
const NUM_LIGHTS = LIGHT_EVENTS.length;

class BeatmathTempo {
    constructor(mixboard, params) {
        this._listeners = [];
        this._mixboard = mixboard;
        this._bpm = params.bpm;
        this._pendingBpm = params.bpm;
        this._bpmMod = _.isNumber(params.bpmMod) ? params.bpmMod : 1;
        this._pendingBpmMod = this._bpmMod;
        this._period = MS_PER_MINUTE / params.bpm / this._bpmMod;
        this._numTicks = -1;
        this._nextTick = Date.now() + this._period;
        this._tick = this._tick.bind(this);
        this._pendingDiff = 0;
        this._resetMeasure = false;
        runAtTimestamp(this._tick, this._nextTick);
        _.times(NUM_LIGHTS, lightNum => mixboard.toggleLight(LIGHT_EVENTS[lightNum], false));
        window.localStorage.setItem('BPM', this._bpm);
        window.localStorage.setItem('BPMMod', this._bpmMod);

        mixboard.addMixtrackButtonListener(BUTTON_1, this._onResetMeasureButtonPress.bind(this));
        mixboard.addMixtrackButtonListener(BUTTON_2, this._onResetPeriodButtonPress.bind(this));
        mixboard.addMixtrackButtonListener(BUTTON_4, this._onIncrementButtonPress.bind(this));
        mixboard.addMixtrackButtonListener(BUTTON_3, this._onDecrementButtonPress.bind(this));

        mixboard.addMixtrackButtonListener(MOD_BUTTON, this._onModButtonPress.bind(this));
    }
    _updateListeners() {
        for (let listener of this._listeners) {
            listener();
        }
    }
    addListener(fn) {
        this._listeners.push(fn);
    }
    removeListener(fn) {
        this._listeners.filter(listener => listener !== fn);
    }
    _tick() {
        if (this._pendingBpm !== this._bpm || this._pendingBpmMod !== this._bpmMod) {
            this._bpm = this._pendingBpm;
            this._bpmMod = this._pendingBpmMod;
            this._period = MS_PER_MINUTE / this._bpm / this._bpmMod;
            window.localStorage.setItem('BPM', this._bpm);
            window.localStorage.setItem('BPMMod', this._bpmMod);
        }
        this._nextTick += this._period;
        if (this._pendingDiff !== 0) {
            this._nextTick += this._pendingDiff;
            this._pendingDiff = 0;
        }
        this._numTicks++;
        if (this._resetMeasure) {
            const numTicksMod16 = posMod(this._numTicks, 16);
            if (numTicksMod16 > 0) {
                this._numTicks += (16 - numTicksMod16);
            }
            this._resetMeasure = false;
        }
        this._updateLights();
        this._updateListeners();
        runAtTimestamp(this._tick, this._nextTick);
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
        const lightToTurnOff = posMod(this._numTicks - 1, NUM_LIGHTS);
        const lightToTurnOn = posMod(this._numTicks, NUM_LIGHTS);
        this._mixboard.toggleLight(LIGHT_EVENTS[lightToTurnOff], false);
        this._mixboard.toggleLight(LIGHT_EVENTS[lightToTurnOn], true);
    }
    _onResetMeasureButtonPress(inputValue) {
        if (inputValue) {
            if (this._isModButtonPressed) {
                this._pendingBpmMod = this._pendingBpmMod / 2;
            } else {
                this._resetMeasure = true;
            }
        }
    }
    _onResetPeriodButtonPress(inputValue) {
        if (inputValue) {
            if (this._isModButtonPressed) {
                this._pendingBpmMod = this._pendingBpmMod * 2;
            } else {
                const now = Date.now();
                const nextTick = this._nextTick;
                const prevTick = nextTick - this._period;
                const nextDiff = now - nextTick;
                const prevDiff = now - prevTick;
                const diffToUse = (Math.abs(nextDiff) < Math.abs(prevDiff)) ? nextDiff : prevDiff;
                this._pendingDiff = diffToUse * 0.75;
            }
        }
    }
    _onIncrementButtonPress(inputValue) {
        if (inputValue) {
            if (this._isModButtonPressed) {
                this._pendingBpm += 0.1;
                this._pendingBpm = Math.round(this._pendingBpm * 10) / 10;
            } else {
                this._pendingBpm += 1;
            }
        }
    }
    _onDecrementButtonPress(inputValue) {
        if (inputValue) {
            if (this._isModButtonPressed) {
                this._pendingBpm -= 0.1;
                this._pendingBpm = Math.round(this._pendingBpm * 10) / 10;
            } else {
                this._pendingBpm -= 1;
            }
        }
    }
    _onModButtonPress(inputValue) {
        this._isModButtonPressed = !!inputValue;
    }
}

module.exports = BeatmathTempo;
