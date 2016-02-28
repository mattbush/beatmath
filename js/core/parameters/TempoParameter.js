// var _ = require('underscore');
// var {lerp, posMod, constrainToRange, modAndShiftToHalf} = require('js/core/utils/math');
var {Parameter} = require('js/core/parameters/Parameter');

class TempoParameter extends Parameter {
    constructor(params) {
        super({start: Date.now() + params.interval});
        this._interval = params.interval;
        this._numTicks = 0;
        this._tick = this._tick.bind(this);
        this._intervalId = setInterval(this._tick, this._interval);
    }
    _tick() {
        this._value += this._interval;
        this._numTicks++;
    }
    getPeriod() {
        return this._interval;
    }
    getNextTick() {
        return this._value;
    }
    getNumTicks() {
        return this._numTicks;
    }
    stopTicking() {
        clearInterval(this._intervalId);
    }
}

module.exports = TempoParameter;
