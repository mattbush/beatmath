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

class MovingParameter extends Parameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        this._updateProperty();
        this._updateListeners();
    }
    _updateProperty() {
        throw new Error('abstract method');
    }
}

class MovingColorParameter extends MovingParameter {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = this._value.spin(this._speed);
    }
}

class MovingAngleParameter extends MovingParameter {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = (this._value + this._speed + 360) % 360;
    }
}

class MovingLinearParameter extends MovingParameter {
    _updateProperty() {
        var next = this._value + this._speed;
        if (next > this._max || next < this._min) {
            this._speed *= -0.5;
        } else {
            this._value += this._speed;
        }
    }
}

module.exports = {MovingColorParameter, MovingAngleParameter, MovingLinearParameter};
