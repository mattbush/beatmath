var {lerp} = require('js/utils/math');

class Parameter {
    constructor({min, max, start}) {
        this._listeners = [];
        this._min = min;
        this._max = max;
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
    listenToFader(mixboard, eventCode) {
        mixboard.addFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToKnob(mixboard, eventCode) {
        mixboard.addFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    onFaderOrKnobUpdate(inputValue) {
        this._value = lerp(this._min, this._max, inputValue);
        this._updateListeners();
    }
    addListener(fn) {
        this._listeners.push(fn);
    }
    removeListener(fn) {
        this._listeners.filter(listener => listener !== fn);
    }
}

class LinearParameter extends Parameter {}

class MovingColorParameter extends Parameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
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

class MovingAngleParameter extends Parameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = (this._value + this._speed + 360) % 360;
        this._updateListeners();
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

module.exports = {LinearParameter, MovingColorParameter, MovingAngleParameter, MovingLinearParameter};
