var _ = require('underscore');
var {mixboardWheel, mixboardFader, mixboardWheelCoefficients} = require('js/inputs/MixboardConstants');

class Mixboard {
    constructor() {
        this._onButtonListeners = {};
        this._onFaderAndKnobListeners = {};
        this._onWheelListeners = {};
    }
    async initAsync() {
        if (this._doesClientSupportMidi()) {
            this._midiInput = await this._getMidiInputAsync();
        } else {
            this._midiInput = null;
        }

        if (this._midiInput !== null) {
            this._midiInput.onmidimessage = this._onMidiMessage.bind(this);
        }
    }
    _doesClientSupportMidi() {
        return window.navigator
          && typeof navigator.requestMIDIAccess === 'function';
    }
    async _getMidiInputAsync() {
        var midiAccess = await navigator.requestMIDIAccess();
        if (!midiAccess ||
            !midiAccess.inputs ||
            midiAccess.inputs.size === 0) {
            return null;
        }

        // todo: work when it's not the first
        return midiAccess.inputs.values().next().value;
    }
    _onMidiMessage(e) {
        // console.log(e.data); // uncomment to discover new event codes
        var [eventType, eventCode, rawValue] = e.data;
        if (eventType === 144) {
            this._onButtonMessage(eventCode, rawValue);
        } else if (eventType === 176) {
            if (eventCode >= mixboardWheel.R_TURNTABLE) {
                this._onWheelMessage(eventCode, rawValue);
            } else {
                this._onFaderAndKnobMessage(eventCode, rawValue);
            }
        }
    }
    _onButtonMessage(eventCode, rawValue) {
        var value = (rawValue > 0);
        this._notifyListeners(this._onButtonListeners, eventCode, value);
    }
    _onFaderAndKnobMessage(eventCode, rawValue) {
        var value = rawValue / 127;
        if (eventCode === mixboardFader.CROSSFADER) { // this one feels backwards
            value = 1 - value;
        }
        this._notifyListeners(this._onFaderAndKnobListeners, eventCode, value);
    }
    _onWheelMessage(eventCode, rawValue) {
        var value = (rawValue >= 64) ? rawValue - 128 : rawValue;
        if (eventCode === mixboardWheel.BROWSE ||
            eventCode === mixboardWheel.L_SELECT ||
            eventCode === mixboardWheel.R_SELECT) { // these ones are definitely backwards
            value = -value;
        }
        value *= mixboardWheelCoefficients[eventCode];
        this._notifyListeners(this._onWheelListeners, eventCode, value);
    }
    _notifyListeners(listenerObj, eventCode, value) {
        if (_.has(listenerObj, eventCode)) {
            _.each(listenerObj[eventCode], fn => fn(value));
        }
    }
    addButtonListener(eventCode, fn) {
        this._addListener(this._onButtonListeners, eventCode, fn);
    }
    addFaderListener(eventCode, fn) {
        this._addListener(this._onFaderAndKnobListeners, eventCode, fn);
    }
    addKnobListener(eventCode, fn) {
        this._addListener(this._onFaderAndKnobListeners, eventCode, fn);
    }
    addWheelListener(eventCode, fn) {
        this._addListener(this._onWheelListeners, eventCode, fn);
    }
    _addListener(listenerObj, eventCode, fn) {
        if (!_.has(listenerObj, eventCode)) {
            listenerObj[eventCode] = [];
        }
        listenerObj[eventCode].push(fn);
    }
}

Mixboard.getInstanceAsync = async function() {
    var mixboard = new Mixboard();
    await mixboard.initAsync();
    return mixboard;
};

module.exports = Mixboard;
