const _ = require('lodash');
const {posMod} = require('js/core/utils/math');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const {runAtTimestamp} = require('js/core/utils/time');

const MixtrackMapping = {
    BUTTONS: [
        MixtrackButtons.R_SYNC,
        MixtrackButtons.R_CUE,
        MixtrackButtons.R_PLAY_PAUSE,
        MixtrackButtons.R_STUTTER,
    ],
    MOD: MixtrackButtons.R_SCRATCH,
};
const LaunchpadMapping = {
    BUTTONS: [
        LaunchpadButtons.RECORD_ARM,
        LaunchpadButtons.SOLO,
        LaunchpadButtons.MUTE,
        LaunchpadButtons.DEVICE,
    ],
    MOD: LaunchpadButtons.TRACK_CONTROL[7],
};

const MS_PER_MINUTE = 60000;

const NUM_LIGHTS = 4;

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
        this._currentTick = Date.now();
        this._nextTick = Date.now() + this._period;
        this._tick = this._tick.bind(this);
        this._pendingDiff = 0;
        this._resetMeasure = false;

        this._buttons = mixboard.isLaunchpad() ? LaunchpadMapping.BUTTONS : MixtrackMapping.BUTTONS;
        this._modButton = mixboard.isLaunchpad() ? LaunchpadMapping.MOD : MixtrackMapping.MOD;

        runAtTimestamp(this._tick, this._nextTick);
        _.times(NUM_LIGHTS, lightNum => mixboard.toggleLight(this._buttons[lightNum], false));
        this._updateMonitor();

        const addListenerMethod = mixboard.isLaunchpad() ? 'addLaunchpadButtonListener' : 'addMixtrackButtonListener';
        mixboard[addListenerMethod](this._buttons[0], this._onResetMeasureButtonPress.bind(this));
        mixboard[addListenerMethod](this._buttons[1], this._onResetPeriodButtonPress.bind(this));
        mixboard[addListenerMethod](this._buttons[3], this._onIncrementButtonPress.bind(this));
        mixboard[addListenerMethod](this._buttons[2], this._onDecrementButtonPress.bind(this));

        mixboard[addListenerMethod](this._modButton, this._onModButtonPress.bind(this));
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
        this._listeners = this._listeners.filter(listener => listener !== fn);
    }
    _tick() {
        if (this._pendingBpm !== this._bpm || this._pendingBpmMod !== this._bpmMod) {
            this._bpm = this._pendingBpm;
            this._bpmMod = this._pendingBpmMod;
            this._period = MS_PER_MINUTE / this._bpm / this._bpmMod;
            this._basePeriod = MS_PER_MINUTE / this._bpm;
            this._updateMonitor();
        }
        this._currentTick = this._nextTick;
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
    _updateMonitor() {
        window.localStorage.setItem('BPM', JSON.stringify({
            name: 'BPM',
            value: this._bpm,
            x: 8.5,
            y: 3.5,
        }));
        window.localStorage.setItem('BPM Mod', JSON.stringify({
            name: 'BPM Mod',
            value: this._bpmMod,
            x: 8.5,
            y: 4.5,
        }));
    }
    getPeriod() {
        return this._period;
    }
    getBasePeriod() {
        return this._basePeriod;
    }
    getNextTick() {
        return this._nextTick;
    }
    getNumTicks() {
        return this._numTicks;
    }
    getProgressTowardsNextTick() {
        return (Date.now() - this._currentTick) / this._period;
    }
    _updateLights() {
        const lightToTurnOff = posMod(this._numTicks - 1, NUM_LIGHTS);
        const lightToTurnOn = posMod(this._numTicks, NUM_LIGHTS);
        this._mixboard.toggleLight(this._buttons[lightToTurnOff], false);
        this._mixboard.toggleLight(this._buttons[lightToTurnOn], true);
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
