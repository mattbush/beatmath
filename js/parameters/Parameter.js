var {lerp, posMod} = require('js/utils/math');

class Parameter {
    constructor({start}) {
        this._listeners = [];
        this._value = start;
    }
    getValue() {
        return this._value;
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
}

class ToggleParameter extends Parameter {
    listenToButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onButtonUpdate.bind(this));
    }
    onButtonUpdate(inputValue) {
        if (inputValue) { // button is pressed down, not up
            this._value = !this._value;
            this._updateListeners();
        }
    }
}

class LinearParameter extends Parameter {
    constructor(params) {
        if (params.startLerp !== undefined) {
            params.start = lerp(params.min, params.max, params.startLerp);
        }
        super(params);
        this._min = params.min;
        this._max = params.max;
        this._lePassedByInput = false;
        this._gePassedByInput = false;
    }
    listenToFader(mixboard, eventCode) {
        mixboard.addFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToKnob(mixboard, eventCode) {
        mixboard.addFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    onFaderOrKnobUpdate(inputValue) {
        var newValue = lerp(this._min, this._max, inputValue);
        // don't update from the fader or knob until you've "met" the current value
        if (!this._lePassedByInput || !this._gePassedByInput) {
            if (newValue >= this._value) {
                this._gePassedByInput = true;
            }
            if (newValue <= this._value) {
                this._lePassedByInput = true;
            }
        }
        if (this._lePassedByInput && this._gePassedByInput) {
            this._value = newValue;
            this._updateListeners();
        }
    }
}

class AngleParameter extends Parameter {
    listenToWheel(mixboard, eventCode) {
        mixboard.addWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    onWheelUpdate(inputValue) {
        this._spinValue(inputValue);
    }
    _spinValue(spinAmount) {
        this._value = posMod(this._value + spinAmount, 360);
        this._updateListeners();
    }
}

class MovingColorParameter extends Parameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
        this._max = params.max;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = this._value.spin(this._speed);
        this._updateListeners();
    }
}

class MovingAngleParameter extends AngleParameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
        this._max = params.max;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._spinValue(this._speed);
    }
}

class MovingLinearParameter extends LinearParameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;

        var next = this._value + this._speed;
        if (next > this._max || next < this._min) {
            this._speed *= -0.5;
        } else {
            this._value += this._speed;
        }

        this._updateListeners();
    }
}

class NextTickParameter extends Parameter {
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
    getNumTicks() {
        return this._numTicks;
    }
    stopTicking() {
        clearInterval(this._intervalId);
    }
}

module.exports = {
    AngleParameter,
    LinearParameter,
    ToggleParameter,
    MovingAngleParameter,
    MovingColorParameter,
    MovingLinearParameter,
    NextTickParameter,
};