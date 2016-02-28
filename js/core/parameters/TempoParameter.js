// var _ = require('underscore');
// var {lerp, posMod, constrainToRange, modAndShiftToHalf} = require('js/core/utils/math');
var {Parameter} = require('js/core/parameters/Parameter');

var MS_PER_MINUTE = 60000;

class TempoParameter extends Parameter {
    constructor(params) {
        super(params.bpm);
        this._period = MS_PER_MINUTE / params.bpm;
        this._numTicks = 0;
        this._nextTick = Date.now() + this._period;
        this._tick = this._tick.bind(this);
        setInterval(this._tick, this._period);
    }
    _tick() {
        this._nextTick += this._period;
        this._numTicks++;
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
}

module.exports = TempoParameter;
