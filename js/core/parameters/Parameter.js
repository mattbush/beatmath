const _ = require('lodash');
const {lerp, logerp, posMod, clamp, modAndShiftToHalf, nextFloat} = require('js/core/utils/math');
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const AutoupdateStatus = require('js/core/parameters/AutoupdateStatus');
const ParameterStatus = require('js/core/parameters/ParameterStatus');
const {LaunchpadKnobOutputCodes} = require('js/core/inputs/LaunchpadConstants');

const STATUS_TO_LIGHT_VALUE = {
    [ParameterStatus.DETACHED]: 0x03,
    [ParameterStatus.BASE]: 0x13,
    [ParameterStatus.MIN]: 0x12,
    [ParameterStatus.MAX]: 0x12,
    [ParameterStatus.CHANGED]: 0x21,
    [ParameterStatus.CHANGING]: 0x30,
};

class Parameter {
    constructor({start, monitorName, manualMonitorCoords}) {
        this._listeners = [];
        this._value = start;
        this._monitorName = monitorName;
        if (manualMonitorCoords) {
            this._monitorX = manualMonitorCoords.x;
            this._monitorY = manualMonitorCoords.y;
        }
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
        this._listeners = this._listeners.filter(listener => listener !== fn);
    }
    addLaunchpadKnobStatusLight(mixboard, row, column) {
        this.addLaunchpadStatusLight(mixboard, LaunchpadKnobOutputCodes[row][column]);
    }
    addLaunchpadButtonStatusLight(mixboard, column) {
        this.addLaunchpadStatusLight(mixboard, LaunchpadButtons.TRACK_CONTROL[column]);
    }
    addLaunchpadStatusLight(mixboard, eventCode) {
        const updateLight = () => {
            const lightValue = this._isUpdatingEnabled ? 0x30 : STATUS_TO_LIGHT_VALUE[this._getStatus()];
            mixboard.setLaunchpadLightValue(eventCode, lightValue);
        };
        updateLight();
        this._listeners.push(updateLight);
    }
    addMixtrackStatusLight(mixboard, eventCode, predicateFn = _.identity) {
        const updateLight = () => {
            mixboard.toggleLight(eventCode, predicateFn(this.getValue()));
        };
        updateLight();
        this._listeners.push(updateLight);
    }
    _updateMonitor() {
        const value = this.getValue();
        const payload = {
            name: this._monitorName,
            value: value,
            x: this._monitorX,
            y: this._monitorY,
            autoStatus: this._isUpdatingEnabled ? AutoupdateStatus.ACTIVE :
                (this._isListeningForAutoupdateCue ? AutoupdateStatus.INACTIVE : AutoupdateStatus.NOT_APPLICABLE),
            status: this._getStatus(),
            type: this._getType(),
        };
        window.localStorage.setItem(this._monitorName, JSON.stringify(payload));
    }
    _getType() {
        return null;
    }
    _getStatus() {
        return ParameterStatus.BASE;
    }
    _setMonitorCoordsFromLaunchpadFader(column) {
        this._monitorX = column;
        this._monitorY = 3.5;
        this._updateMonitor();
    }
    _setMonitorCoordsFromLaunchpadKnob(row, column) {
        this._monitorX = column;
        this._monitorY = row;
        this._updateMonitor();
    }
    _setMonitorCoordsFromLaunchpadButton(column) {
        this._monitorX = column;
        this._monitorY = 5;
        this._updateMonitor();
    }
    _setMonitorCoordsFromLaunchpadSideButton(buttonCode) {
        this._monitorX = 8.5;
        this._monitorY = (buttonCode === LaunchpadButtons.LEFT || buttonCode === LaunchpadButtons.RIGHT)
            ? 2
            : (buttonCode === LaunchpadButtons.UP ? 0 : 1);
        this._updateMonitor();
    }
    listenForAutoupdateCue(mixboard) {
        this._isUpdatingEnabled = false;
        this._isListeningForAutoupdateCue = true;
        if (mixboard.isLaunchpad()) {
            mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[7], this.onAutoupdateCuePressed.bind(this));
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
                this._updateListeners({forceUpdate: true});
            }
            return !this._isUpdatingEnabled;
        }
        return true;
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
        this.addMixtrackStatusLight(mixboard, eventCode);
    }
    listenToLaunchpadSideButton(mixboard, eventCode) {
        mixboard.addLaunchpadButtonListener(eventCode, this.onButtonUpdate.bind(this));
        this._setMonitorCoordsFromLaunchpadSideButton(eventCode);
    }
    listenToLaunchpadButton(mixboard, column) {
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[column], this.onButtonUpdate.bind(this));
        this._setMonitorCoordsFromLaunchpadButton(column);
        this.addLaunchpadButtonStatusLight(mixboard, column);
    }
    onButtonUpdate(inputValue) {
        if (inputValue) { // button is pressed down, not up
            this._value = !this._value;
            this._updateListeners();
        }
    }
    _getStatus() {
        return this._value ? ParameterStatus.CHANGED : ParameterStatus.BASE;
    }
    _getType() {
        return 'Toggle';
    }
}

class CycleParameter extends Parameter {
    constructor(params) {
        params.start = params.cycleValues[0];
        super(params);

        this._cycleValues = params.cycleValues;
        this._valueIndex = 0;
    }
    listenToDecrementAndIncrementLaunchpadSideButtons(mixboard, decrementCode, incrementCode) {
        mixboard.addLaunchpadButtonListener(decrementCode, this.onDecrementButtonPress.bind(this));
        mixboard.addLaunchpadButtonListener(incrementCode, this.onIncrementButtonPress.bind(this));
        this._setMonitorCoordsFromLaunchpadSideButton(decrementCode);
    }
    listenToCycleLaunchpadSideButton(mixboard, eventCode) {
        mixboard.addLaunchpadButtonListener(eventCode, this.onIncrementButtonPress.bind(this));
        this._setMonitorCoordsFromLaunchpadSideButton(eventCode);
    }
    listenToDecrementAndIncrementLaunchpadButtons(mixboard, column) {
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_FOCUS[column], this.onIncrementButtonPress.bind(this));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[column], this.onDecrementButtonPress.bind(this));
        this._setMonitorCoordsFromLaunchpadButton(column);
        this.addLaunchpadButtonStatusLight(mixboard, column);
    }
    listenToCycleAndResetMixtrackButtons(mixboard, cycleCode, resetCode) {
        this.listenToCycleMixtrackButton(mixboard, cycleCode);
        this.listenToResetMixtrackButton(mixboard, resetCode);
        this.addMixtrackStatusLight(mixboard, cycleCode, value => value !== this._cycleValues[0]);
    }
    listenToCycleMixtrackButton(mixboard, eventCode) {
        mixboard.addMixtrackButtonListener(eventCode, this.onIncrementButtonPress.bind(this));
    }
    onIncrementButtonPress(inputValue) {
        if (inputValue) {
            this._moveValueIndex(1);
        }
    }
    onDecrementButtonPress(inputValue) {
        if (inputValue) {
            this._moveValueIndex(-1);
        }
    }
    _moveValueIndex(delta) {
        this._valueIndex = posMod(this._valueIndex + delta, this._cycleValues.length);
        this._value = this._cycleValues[this._valueIndex];
        this._updateListeners();
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
        this._useStartAsMidpoint = params.useStartAsMidpoint;
    }
    listenToLaunchpadFader(mixboard, column, opts = {}) {
        mixboard.addLaunchpadFaderListener(column, this.onFaderOrKnobUpdate.bind(this));
        this._setMonitorCoordsFromLaunchpadFader(column);
        if (opts.addButtonStatusLight) {
            this.addLaunchpadStatusLight(mixboard, LaunchpadButtons.TRACK_FOCUS[column]);
        }
    }
    listenToLaunchpadKnob(mixboard, row, column, opts = {}) {
        mixboard.addLaunchpadKnobListener(row, column, this.onFaderOrKnobUpdate.bind(this));
        this._setMonitorCoordsFromLaunchpadKnob(row, column);
        this.addLaunchpadKnobStatusLight(mixboard, row, column);
        if (opts.useSnapButton) {
            mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_FOCUS[7], value => this._isSnapButtonPressed = value);
        }
    }
    listenToDecrementAndIncrementLaunchpadButtons(mixboard, column) {
        this._lePassedByInput = true;
        this._gePassedByInput = true;
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_FOCUS[column], this.onIncrementButtonPress.bind(this));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_CONTROL[column], this.onDecrementButtonPress.bind(this));
        this._setMonitorCoordsFromLaunchpadButton(column);
        this.addLaunchpadButtonStatusLight(mixboard, column);
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
        this.addMixtrackStatusLight(mixboard, eventCode, value => value !== this._defaultOff);
    }
    listenToDecrementAndIncrementMixtrackButtons(mixboard, decrementCode, incrementCode) {
        this.listenToIncrementMixtrackButton(mixboard, incrementCode);
        this.listenToDecrementMixtrackButton(mixboard, decrementCode);
        if (this._defaultOff === this._minParam.getValue()) {
            this.addMixtrackStatusLight(mixboard, incrementCode, value => value > this._minParam.getValue());
            this.addMixtrackStatusLight(mixboard, decrementCode, value => value >= this._maxParam.getValue());
        } else {
            this.addMixtrackStatusLight(mixboard, incrementCode, value => value > this._defaultOff);
            this.addMixtrackStatusLight(mixboard, decrementCode, value => value < this._defaultOff);
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
            const newValue = this._increment(this._value, this._incrementAmount);
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onDecrementButtonPress(inputValue) {
        if (inputValue) {
            const newValue = this._decrement(this._value, this._incrementAmount);
            this._constrainToRangeAndUpdateValue(newValue);
        }
    }
    onWheelUpdate(inputValue) {
        const newValue = this._value + (inputValue * this._incrementAmount);
        this._constrainToRangeAndUpdateValue(newValue);
    }
    _constrainToRangeAndUpdateValue(newValue) {
        newValue = clamp(newValue, this._minParam.getValue(), this._maxParam.getValue());
        if (newValue !== this._value) {
            this._value = newValue;
            this._updateListeners();
        }
    }
    onFaderOrKnobUpdate(inputValue) {
        let newValue;
        if (this._useStartAsMidpoint) {
            if (inputValue >= 0.5) {
                newValue = this._interpolate(this._defaultOff, this._maxParam.getValue(), (inputValue - 0.5) * 2);
            } else {
                newValue = this._interpolate(this._minParam.getValue(), this._defaultOff, inputValue * 2);
            }
        } else {
            newValue = this._interpolate(this._minParam.getValue(), this._maxParam.getValue(), inputValue);
        }
        if (this._isSnapButtonPressed) {
            newValue = Math.round(newValue);
        }

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
    _increment(value, amount) {
        return value + amount;
    }
    _decrement(value, amount) {
        return value - amount;
    }
    _interpolate(min, max, interpolation) {
        return lerp(min, max, interpolation);
    }
    _getStatus() {
        if (!this._lePassedByInput || !this._gePassedByInput) {
            return ParameterStatus.DETACHED;
        }
        const value = this.getValue();

        if (value === this._minParam.getValue()) {
            return ParameterStatus.MIN;
        } else if (value === this._maxParam.getValue()) {
            return ParameterStatus.MAX;
        } else if (value === this._defaultOff) {
            return ParameterStatus.BASE;
        }
        return ParameterStatus.CHANGED;
    }
}

class LogarithmicParameter extends LinearParameter {
    constructor(params) {
        if (params.incrementAmount === undefined) {
            params.incrementAmount = 2;
        }
        super(params);
    }
    _increment(value, amount) {
        return value * amount;
    }
    _decrement(value, amount) {
        return value / amount;
    }
    _interpolate(min, max, interpolation) {
        return logerp(min, max, interpolation);
    }
}

class IntLinearParameter extends LinearParameter {
    getValue() {
        return Math.round(super.getValue());
    }
    _updateListeners(opts = {}) {
        if (!opts.forceUpdate && this.getValue() === this._lastIntegerValue) {
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
        this._tempo = params.tempo;
        this._onLaunchpadKnobSpinInterval = this._onLaunchpadKnobSpinInterval.bind(this);
        this._knobSensitivity = params.knobSensitivity || 1;
    }
    listenToLaunchpadKnob(mixboard, row, column) {
        mixboard.addLaunchpadKnobListener(row, column, this.onLaunchpadKnobUpdate.bind(this));
        mixboard.addLaunchpadButtonListener(LaunchpadButtons.TRACK_FOCUS[7], value => this._isSnapButtonPressed = value);
        this._setMonitorCoordsFromLaunchpadKnob(row, column);
        this.addLaunchpadKnobStatusLight(mixboard, row, column);
    }
    listenToMixtrackWheel(mixboard, eventCode) {
        mixboard.addMixtrackWheelListener(eventCode, this.onWheelUpdate.bind(this));
    }
    onLaunchpadKnobUpdate(inputValue) {
        inputValue -= 0.5;
        this._launchpadKnobValue = inputValue * Math.abs(inputValue) * 30 * this._knobSensitivity;
        if (inputValue !== 0 && !this._launchpadKnobIntervalId) {
            let intervalMs;
            if (this._tempo) {
                intervalMs = this._tempo.getBasePeriod() / 16;
            } else {
                intervalMs = 20;
            }
            this._launchpadKnobIntervalId = setInterval(this._onLaunchpadKnobSpinInterval, intervalMs);
            this._onLaunchpadKnobSpinInterval();
        } else if (inputValue === 0 && this._launchpadKnobIntervalId) {
            clearInterval(this._launchpadKnobIntervalId);
            this._launchpadKnobIntervalId = null;
            this._updateListeners({forceUpdate: true});
        }
    }
    _onLaunchpadKnobSpinInterval() {
        if (this._isSnapButtonPressed) {
            this.onSnapButton(true);
        } else {
            this._spinValue(this._launchpadKnobValue);
        }
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
        if (spinAmount === 0) {
            return;
        }
        this._value = this._value + spinAmount;
        if (this._constrainTo !== false) {
            this._value = posMod(this._value, this._constrainTo);
        }
        this._updateListeners();
    }
    _getStatus() {
        if (this._launchpadKnobIntervalId) {
            return ParameterStatus.CHANGING;
        }
        const value = this.getValue();
        if (value % 15 === 0) {
            return ParameterStatus.BASE;
        }
        return ParameterStatus.CHANGED;
    }
    _getType() {
        return 'Angle';
    }
    destroy() {
        super.destroy();
        if (this._launchpadKnobIntervalId) {
            clearInterval(this._launchpadKnobIntervalId);
            this._launchpadKnobIntervalId = null;
        }
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
        super.destroy();
        clearInterval(this._autoupdateInterval);
    }
}

class MovingAngleParameter extends AngleParameter {
    constructor(params) {
        super(params);
        this._variance = params.variance;
        this._speed = 0;
        this._maxSpeed = params.max;
        this._isUpdatingEnabled = true;
    }
    update() {
        if (!this._isUpdatingEnabled) {
            return;
        }
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        if (Math.abs(this._speed) > this._maxSpeed) {
            this._speed *= 0.5;
        }
        this._spinValue(this._speed);
    }
    onResetButtonPress(inputValue) {
        if (!inputValue || this._checkAutopilotToggle()) {
            super.onResetButtonPress(inputValue);
        }
    }
    onSnapButton(inputValue) {
        if (!inputValue || this._checkAutopilotToggle()) {
            super.onSnapButton(inputValue);
        }
    }
    onLaunchpadKnobUpdate(inputValue) {
        if (this._checkAutopilotToggle()) {
            super.onLaunchpadKnobUpdate(inputValue);
        }
    }
    onWheelUpdate(inputValue) {
        if (this._checkAutopilotToggle()) {
            super.onWheelUpdate(inputValue);
        }
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

        const nextOriginal = this._increment(this._value, this._getSpeedAsIncrement());
        const min = this._autoupdateRange ? this._autoupdateRange[0] : this._minParam.getValue();
        const max = this._autoupdateRange ? this._autoupdateRange[1] : this._maxParam.getValue();

        const nextConstrained = clamp(nextOriginal, min, max);

        // if speed is positive and we're past max, or vice versa
        if ((nextConstrained < nextOriginal && this._speed > 0) ||
            (nextConstrained > nextOriginal && this._speed < 0)) {
            this._speed *= -0.5;
        }

        this._value = nextConstrained;
        this._updateListeners();
    }
    _getSpeedAsIncrement() {
        return this._speed;
    }
    destroy() {
        super.destroy();
        clearInterval(this._autoupdateInterval);
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

class MovingLogarithmicParameter extends MovingLinearParameter {
    constructor(params) {
        if (params.incrementAmount === undefined) {
            params.incrementAmount = 2;
        }
        super(params);
    }
    _increment(value, amount) {
        return value * amount;
    }
    _decrement(value, amount) {
        return value / amount;
    }
    _interpolate(min, max, interpolation) {
        return logerp(min, max, interpolation);
    }
    _getSpeedAsIncrement() {
        return 2 ** this._speed;
    }
}

class MovingIntLinearParameter extends MovingLinearParameter {
    getValue() {
        return Math.round(super.getValue());
    }
    _updateListeners(opts = {}) {
        if (!opts.forceUpdate && this.getValue() === this._lastIntegerValue) {
            return;
        }
        super._updateListeners();
        this._lastIntegerValue = this.getValue();
    }
}

class ManualParameter extends Parameter {
    setValue(value) {
        this._value = value;
        this._updateListeners();
    }
}

module.exports = {
    Parameter,
    NegatedParameter,
    AngleParameter,
    LinearParameter,
    LogarithmicParameter,
    IntLinearParameter,
    ToggleParameter,
    CycleParameter,
    MovingAngleParameter,
    MovingColorParameter,
    MovingLinearParameter,
    MovingLogarithmicParameter,
    MovingIntLinearParameter,
    ManualParameter,
};
