const _ = require('underscore');
const {lerp, posMod, constrainToRange, modAndShiftToHalf, nextFloat} = require('js/core/utils/math');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');

class Parameter {
    constructor({start, monitorName}) {
        this._listeners = [];
        this._value = start;
        this._monitorName = monitorName;
        if (monitorName) {
            this.addListener(this._updateMonitor.bind(this));
        }
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
    addStatusLight(mixboard, eventCode, predicateFn = _.identity) {
        const updateLight = () => {
            mixboard.toggleLight(eventCode, predicateFn(this.getValue()));
        };
        updateLight();
        this._listeners.push(updateLight);
    }
    _updateMonitor() {
        let value = this.getValue();
        value = _.isNumber(value) ? Math.round(value * 1000) / 1000 : value;
        if (this._isUpdatingEnabled) {
            value = value + ' (Auto)';
        }
        window.localStorage.setItem(this._monitorName, value);
    }
    destroy() {}
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

const wrapParam = function(value) {
    if (!(value instanceof Parameter)) {
        value = new Parameter({start: value});
    }
    return value;
};

class ToggleParameter extends Parameter {
    listenToMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onButtonUpdate.bind(this));
        this.addStatusLight(mixboard, eventCode);
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
    listenToCycleAndResetMixtrackButtons(mixboard, cycleCode, resetCode) {
        this.listenToCycleMixtrackButton(mixboard, cycleCode);
        this.listenToResetMixtrackButton(mixboard, resetCode);
        this.addStatusLight(mixboard, cycleCode, value => value !== this._cycleValues[0]);
    }
    listenToCycleMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onCycleButtonPress.bind(this));
    }
    onCycleButtonPress(inputValue) {
        if (inputValue) {
            this._valueIndex = posMod(this._valueIndex + 1, this._cycleValues.length);
            this._value = this._cycleValues[this._valueIndex];
            this._updateListeners();
        }
    }
    listenToResetMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onResetButtonPress.bind(this));
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
        let [min, max] = params.range;
        min = wrapParam(min);
        max = wrapParam(max);
        if (params.startLerp !== undefined) {
            params.start = lerp(min.getValue(), max.getValue(), params.startLerp);
        }
        super(params);
        this._minParam = min;
        this._maxParam = max;
        this._incrementAmount = params.incrementAmount || 1;
        this._lePassedByInput = false;
        this._gePassedByInput = false;
        this._defaultOff = params.start;
        this._defaultOn = params.defaultOn;
    }
    listenToMixtrackFader(mixboard, eventCode) {
        mixboard.addMixtrackFaderListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToMixtrackKnob(mixboard, eventCode) {
        mixboard.addMixtrackKnobListener(eventCode, this.onFaderOrKnobUpdate.bind(this));
    }
    listenToMixtrackWheel(mixboard, eventCode) {
        mixboard.addMixtrackWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    listenToResetMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onResetButtonPress.bind(this));
        this.addStatusLight(mixboard, eventCode, value => value !== this._defaultOff);
    }
    listenToDecrementAndIncrementMixtrackButtons(mixboard, decrementCode, incrementCode) {
        this.listenToIncrementMixtrackButton(mixboard, incrementCode);
        this.listenToDecrementMixtrackButton(mixboard, decrementCode);
        if (this._defaultOff === this._minParam.getValue()) {
            this.addStatusLight(mixboard, incrementCode, value => value > this._minParam.getValue());
            this.addStatusLight(mixboard, decrementCode, value => value >= this._maxParam.getValue());
        } else {
            this.addStatusLight(mixboard, incrementCode, value => value > this._defaultOff);
            this.addStatusLight(mixboard, decrementCode, value => value < this._defaultOff);
        }
    }
    listenToIncrementMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onIncrementButtonPress.bind(this));
    }
    listenToDecrementMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onDecrementButtonPress.bind(this));
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
            const newValue = this._value + this._incrementAmount;
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onDecrementButtonPress(inputValue) {
        if (inputValue) {
            const newValue = this._value - this._incrementAmount;
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onWheelUpdate(inputValue) {
        const newValue = this._value + (inputValue * this._incrementAmount);
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
        const newValue = lerp(this._minParam.getValue(), this._maxParam.getValue(), inputValue);
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

class IntLinearParameter extends LinearParameter {
    getValue() {
        return Math.round(super.getValue());
    }
    _updateListeners() {
        if (this.getValue() === this._lastIntegerValue) {
            return;
        }
        super._updateListeners();
        this._lastIntegerValue = this.getValue();
    }
}

class AngleParameter extends Parameter {
    constructor(params) {
        if (params.start === AngleParameter.RANDOM_ANGLE) {
            params.start = nextFloat(360);
        }
        super(params);
        this._constrainTo = (params.constrainTo !== undefined) ? params.constrainTo : 360;
        this._defaultOff = params.start;
    }
    listenToMixtrackWheel(mixboard, eventCode) {
        mixboard.addMixtrackWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    onWheelUpdate(inputValue) {
        this._spinValue(inputValue);
    }
    listenToSnapMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onSnapButton.bind(this));
    }
    onSnapButton(inputValue) {
        if (inputValue) {
            const distanceFromClosestMultipleOf15 = modAndShiftToHalf(this._value, 15);
            this._spinValue(-distanceFromClosestMultipleOf15);
        }
    }
    listenToResetMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onResetButtonPress.bind(this));
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
            this._autoupdateInterval = setInterval(this.update.bind(this), params.autoupdate);
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
    destroy() {
        clearInterval(this._autoupdateInterval);
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
        this._autoupdateRange = params.autoupdateRange;
        this._speed = 0;
        if (params.autoupdate !== undefined) {
            this._autoupdateInterval = setInterval(this.update.bind(this), params.autoupdate);
        }
        this._isUpdatingEnabled = true;
    }
    update() {
        if (!this._isUpdatingEnabled) {
            return;
        }
        this._speed += (Math.random() * this._variance * 2) - this._variance;

        const nextOriginal = this._value + this._speed;
        const min = this._autoupdateRange ? this._autoupdateRange[0] : this._minParam.getValue();
        const max = this._autoupdateRange ? this._autoupdateRange[1] : this._maxParam.getValue();

        const nextConstrained = constrainToRange(min, max, nextOriginal);

        // if speed is positive and we're past max, or vice versa
        if ((nextConstrained < nextOriginal && this._speed > 0) ||
            (nextConstrained > nextOriginal && this._speed < 0)) {
            this._speed *= -0.5;
        }

        this._value = nextConstrained;
        this._updateListeners();
    }
    destroy() {
        clearInterval(this._autoupdateInterval);
    }
    listenForAutoupdateCue(mixboard) {
        this._isUpdatingEnabled = false;
        if (mixboard.isLaunchpad()) {
            mixboard.addLaunchpadButtonListener(LaunchpadButtons.RECORD_ARM, this.onAutoupdateCuePressed.bind(this));
        } else {
            mixboard.addMixtrackButtonListener(MixtrackButtons.L_CUE, this.onAutoupdateCuePressed.bind(this));
        }
    }
    onAutoupdateCuePressed(inputValue) {
        this._isAutoupdateCuePressed = inputValue;
        this._canChangeAutoupdate = inputValue;
    }
    _checkAutopilotToggle() {
        if (this._isAutoupdateCuePressed) {
            if (this._canChangeAutoupdate) {
                this._isUpdatingEnabled = !this._isUpdatingEnabled;
                this._canChangeAutoupdate = false;
                this._updateMonitor();
            }
            return !this._isUpdatingEnabled;
        }
        return true;
    }
    onResetButtonPress(inputValue) {
        if (!inputValue || this._checkAutopilotToggle()) {
            super.onResetButtonPress(inputValue);
        }
    }
    onIncrementButtonPress(inputValue) {
        if (!inputValue || this._checkAutopilotToggle()) {
            super.onIncrementButtonPress(inputValue);
        }
    }
    onDecrementButtonPress(inputValue) {
        if (!inputValue || this._checkAutopilotToggle()) {
            super.onDecrementButtonPress(inputValue);
        }
    }
    onWheelUpdate(inputValue) {
        if (this._checkAutopilotToggle()) {
            super.onWheelUpdate(inputValue);
        }
    }
    onFaderOrKnobUpdate(inputValue) {
        if (this._checkAutopilotToggle()) {
            super.onFaderOrKnobUpdate(inputValue);
        }
    }
}

module.exports = {
    Parameter,
    NegatedParameter,
    AngleParameter,
    LinearParameter,
    IntLinearParameter,
    ToggleParameter,
    CycleParameter,
    MovingAngleParameter,
    MovingColorParameter,
    MovingLinearParameter,
};
