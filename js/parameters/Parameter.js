var {lerp, posMod, constrainToRange, modAndShiftToHalf} = require('js/utils/math');

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

class NegatedParameter extends Parameter {
    constructor(parameter) {
        super({start: undefined}); // unused
        this._parameter = parameter;
        parameter.addListener(this._updateListeners.bind(this));
    }
    getValue() {
        return -this._parameter.getValue();
    }
}

var wrapParam = function(value) {
    if (!(value instanceof Parameter)) {
        value = new Parameter({start: value});
    }
    return value;
};

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

class CycleParameter extends Parameter {
    constructor(params) {
        params.start = params.cycleValues[0];
        super(params);

        this._cycleValues = params.cycleValues;
        this._valueIndex = 0;
    }
    listenToCycleButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onCycleButtonPress.bind(this));
    }
    onCycleButtonPress(inputValue) {
        if (inputValue) {
            this._valueIndex = posMod(this._valueIndex + 1, this._cycleValues.length);
            this._value = this._cycleValues[this._valueIndex];
            this._updateListeners();
        }
    }
    listenToResetButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onResetButtonPress.bind(this));
    }
    onResetButtonPress(inputValue) {
        if (inputValue) {
            this._valueIndex = 0;
            this._value = this._cycleValues[this._valueIndex];
            this._updateListeners();
        }
    }
}

class LinearParameter extends Parameter {
    constructor(params) {
        params.min = wrapParam(params.min);
        params.max = wrapParam(params.max);
        if (params.startLerp !== undefined) {
            params.start = lerp(params.min.getValue(), params.max.getValue(), params.startLerp);
        }
        super(params);
        this._minParam = params.min;
        this._maxParam = params.max;
        this._incrementAmount = params.incrementAmount || 1;
        this._lePassedByInput = false;
        this._gePassedByInput = false;
        this._defaultOff = params.start;
        this._defaultOn = params.defaultOn;
    }
    listenToFader(mixboard, eventCode) {
        mixboard.addFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToKnob(mixboard, eventCode) {
        mixboard.addKnobListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToWheel(mixboard, eventCode) {
        mixboard.addWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    listenToResetButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onResetButtonPress.bind(this));
    }
    listenToIncrementButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onIncrementButtonPress.bind(this));
    }
    listenToDecrementButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onDecrementButtonPress.bind(this));
    }
    onResetButtonPress(inputValue) {
        if (inputValue) {
            if (this._value === this._defaultOff && this._defaultOn !== undefined) {
                this._value = this._defaultOn;
            } else {
                this._value = this._defaultOff;
            }
            this._updateListeners();
        }
    }
    onIncrementButtonPress(inputValue) {
        if (inputValue) {
            var newValue = this._value + this._incrementAmount;
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onDecrementButtonPress(inputValue) {
        if (inputValue) {
            var newValue = this._value - this._incrementAmount;
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onWheelUpdate(inputValue) {
        var newValue = this._value + (inputValue * this._incrementAmount);
        this._constrainToRangeAndUpdateValue(newValue);
    }
    _constrainToRangeAndUpdateValue(newValue) {
        newValue = constrainToRange(this._minParam.getValue(), this._maxParam.getValue(), newValue);
        if (newValue !== this._value) {
            this._value = newValue;
            this._updateListeners();
        }
    }
    onFaderOrKnobUpdate(inputValue) {
        var newValue = lerp(this._minParam.getValue(), this._maxParam.getValue(), inputValue);
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
    constructor(params) {
        super(params);
        this._constrainTo = (params.constrainTo !== undefined) ? params.constrainTo : 360;
        this._defaultOff = params.start;
    }
    listenToWheel(mixboard, eventCode) {
        mixboard.addWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    onWheelUpdate(inputValue) {
        this._spinValue(inputValue);
    }
    listenToSnapButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onSnapButton.bind(this));
    }
    onSnapButton(inputValue) {
        if (inputValue) {
            var distanceFromClosestMultipleOf15 = modAndShiftToHalf(this._value, 15);
            this._spinValue(-distanceFromClosestMultipleOf15);
        }
    }
    listenToResetButton(mixboard, eventCode) {
        mixboard.addButtonListener(eventCode, this.onResetButtonPress.bind(this));
    }
    onResetButtonPress(inputValue) {
        if (inputValue) {
            this._value = this._defaultOff;
            this._updateListeners();
        }
    }
    _spinValue(spinAmount) {
        this._value = this._value + spinAmount;
        if (this._constrainTo !== false) {
            this._value = posMod(this._value, this._constrainTo);
        }
        this._updateListeners();
    }
}

class MovingColorParameter extends Parameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
        this._maxSpeed = params.max;
        if (params.autoupdate !== undefined) {
            setInterval(this.update.bind(this), params.autoupdate);
        }
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._maxSpeed) {
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
        this._maxSpeed = params.max;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._maxSpeed) {
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

        var nextOriginal = this._value + this._speed;
        var nextConstrained = constrainToRange(this._minParam.getValue(), this._maxParam.getValue(), nextOriginal);

        // if speed is positive and we're past max, or vice versa
        if ((nextConstrained < nextOriginal && this._speed > 0) ||
            (nextConstrained > nextOriginal && this._speed < 0)) {
            this._speed *= -0.5;
        }

        this._value = nextConstrained;
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
    Parameter,
    NegatedParameter,
    AngleParameter,
    LinearParameter,
    ToggleParameter,
    CycleParameter,
    MovingAngleParameter,
    MovingColorParameter,
    MovingLinearParameter,
    NextTickParameter,
};
