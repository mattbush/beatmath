const _ = require('lodash');
const {MixtrackWheels, MixtrackFaders, MixtrackWheelCoefficients} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadFaderInputCodes, LaunchpadKnobInputCodes, LaunchpadKnobOutputCodes, LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');

class Mixboard {
    constructor() {
        this._onMixtrackButtonListeners = {};
        this._onMixtrackFaderAndKnobListeners = {};
        this._onMixtrackWheelListeners = {};
        this._onLaunchpadButtonListeners = {};
        this._onLaunchpadFaderAndKnobListeners = {};
    }
    async initAsync() {
        this._midiInput = null;
        this._midiOutput = null;

        if (this._doesClientSupportMidi()) {
            await this._setupMidiIvarsAsync();
        }

        if (this._midiInput !== null) {
            if (this.isLaunchpad()) {
                this._midiInput.onmidimessage = this._onLaunchpadMidiMessage.bind(this);
            } else {
                this._midiInput.onmidimessage = this._onMixtrackMidiMessage.bind(this);
            }
        }
        if (this._midiOutput === null) {
            this.toggleLight = _.noop;
        }
        window.mixboard = this;
    }
    _doesClientSupportMidi() {
        return window.navigator
          && typeof navigator.requestMIDIAccess === 'function';
    }
    isMixboardConnected() {
        return this._midiInput !== null;
    }
    isLaunchpad() {
        return this.isMixboardConnected() && this._midiInput.name === 'Launch Control XL';
    }
    async _setupMidiIvarsAsync() {
        const midiAccess = await navigator.requestMIDIAccess();
        if (!midiAccess) {
            return;
        }

        window.midiAccess = midiAccess;

        // todo: work when it's not the first
        if (midiAccess.inputs && midiAccess.inputs.size > 0) {
            const iterator = midiAccess.inputs.values();
            this._midiInput = iterator.next().value;
            if (midiAccess.inputs.size > 1 && this._midiInput.name.toLowerCase().includes('traktor')) {
                this._midiInput = iterator.next().value;
            }
        }
        if (midiAccess.outputs && midiAccess.outputs.size > 0) {
            const iterator = midiAccess.outputs.values();
            this._midiOutput = iterator.next().value;
            if (midiAccess.outputs.size > 1 && this._midiOutput.name.toLowerCase().includes('traktor')) {
                this._midiOutput = iterator.next().value;
            }

        }
    }
    _onMixtrackMidiMessage(e) {
        // console.log(e.data); // uncomment to discover new event codes
        const [eventType, eventCode, rawValue] = e.data;
        if (eventType === 144) {
            this._onMixtrackButtonMessage(eventCode, rawValue);
        } else if (eventType === 176) {
            if (eventCode >= MixtrackWheels.R_TURNTABLE) {
                this._onMixtrackWheelMessage(eventCode, rawValue);
            } else {
                this._onMixtrackFaderAndKnobMessage(eventCode, rawValue);
            }
        }
    }
    _onMixtrackButtonMessage(eventCode, rawValue) {
        const value = (rawValue > 0);
        this._notifyListeners(this._onMixtrackButtonListeners, eventCode, value);
    }
    _onMixtrackFaderAndKnobMessage(eventCode, rawValue) {
        let value = rawValue / 127;
        if (eventCode === MixtrackFaders.CROSSFADER) { // this one feels backwards
            value = 1 - value;
        }
        this._notifyListeners(this._onMixtrackFaderAndKnobListeners, eventCode, value);
    }
    _onMixtrackWheelMessage(eventCode, rawValue) {
        let value = (rawValue >= 64) ? rawValue - 128 : rawValue;
        if (eventCode === MixtrackWheels.BROWSE ||
            eventCode === MixtrackWheels.L_SELECT ||
            eventCode === MixtrackWheels.R_SELECT) { // these ones are definitely backwards
            value = -value;
        }
        value *= MixtrackWheelCoefficients[eventCode];
        this._notifyListeners(this._onMixtrackWheelListeners, eventCode, value);
    }
    _onLaunchpadMidiMessage(e) {
        // console.log(e.data); // uncomment to discover new event codes
        const [eventType, eventCode, rawValue] = e.data;
        if (eventType === 152 || eventType === 136) {
            this._onLaunchpadButtonMessage(eventCode, eventType === 152 ? 1 : 0);
        } else if (eventType === 184) {
            if (eventCode >= 104) { // UP
                this._onLaunchpadButtonMessage(eventCode + 100, rawValue);
            } else {
                this._onLaunchpadFaderAndKnobMessage(eventCode, rawValue);
            }
        }
    }
    _onLaunchpadButtonMessage(eventCode, rawValue) {
        const value = (rawValue > 0);
        this._notifyListeners(this._onLaunchpadButtonListeners, eventCode, value);
    }
    _onLaunchpadFaderAndKnobMessage(eventCode, rawValue) {
        // make 64 map to exactly 0.5
        const value = rawValue ? ((rawValue - 1) / 126) : 0;
        this._notifyListeners(this._onLaunchpadFaderAndKnobListeners, eventCode, value);
    }
    _notifyListeners(listenerObj, eventCode, value) {
        if (_.has(listenerObj, eventCode)) {
            _.each(listenerObj[eventCode], fn => fn(value));
        }
    }
    addMixtrackButtonListener(eventCode, fn) {
        this._addListener(this._onMixtrackButtonListeners, eventCode, fn);
    }
    addMixtrackFaderListener(eventCode, fn) {
        this._addListener(this._onMixtrackFaderAndKnobListeners, eventCode, fn);
    }
    addMixtrackKnobListener(eventCode, fn) {
        this._addListener(this._onMixtrackFaderAndKnobListeners, eventCode, fn);
    }
    addMixtrackWheelListener(eventCode, fn) {
        this._addListener(this._onMixtrackWheelListeners, eventCode, fn);
    }
    addLaunchpadButtonListener(eventCode, fn) {
        this._addListener(this._onLaunchpadButtonListeners, eventCode, fn);
    }
    addLaunchpadFaderListener(column, fn) {
        this._addListener(this._onLaunchpadFaderAndKnobListeners, LaunchpadFaderInputCodes[column], fn);
    }
    addLaunchpadKnobListener(row, column, fn) {
        this._addListener(this._onLaunchpadFaderAndKnobListeners, LaunchpadKnobInputCodes[row][column], fn);
    }
    _clearLaunchpadLight(eventCode) {
        this._midiOutput.send([152, eventCode, 0]);
    }
    setLaunchpadLightValue(eventCode, lightCode) {
        this._midiOutput.send([152, eventCode, lightCode]);
    }
    toggleLight(eventCode, isLightOn) {
        if (this.isLaunchpad()) {
            // note that this doesn't work for side buttons
            const value = isLightOn ? 0x33 : 0;
            this._midiOutput.send([152, eventCode, value]);
        } else {
            const eventType = isLightOn ? 0x90 : 0x80;
            this._midiOutput.send([eventType, eventCode, 1]);
        }
    }
    toggleLaunchpadDirectionalLight(eventCode, isLightOn) {
        const value = isLightOn ? 0x33 : 0;
        this._midiOutput.send([152, eventCode - 100, value]);
    }
    resetLaunchpadLights() {
        _.times(8, column => {
            _.times(3, row => {
                this._clearLaunchpadLight(LaunchpadKnobOutputCodes[row][column]);
            });
            this._clearLaunchpadLight(LaunchpadButtons.TRACK_FOCUS[column]);
            this._clearLaunchpadLight(LaunchpadButtons.TRACK_CONTROL[column]);
        });
        this._clearLaunchpadLight(LaunchpadButtons.DEVICE);
        this._clearLaunchpadLight(LaunchpadButtons.MUTE);
        this._clearLaunchpadLight(LaunchpadButtons.SOLO);
        this._clearLaunchpadLight(LaunchpadButtons.RECORD_ARM);
    }
    _addListener(listenerObj, eventCode, fn) {
        if (!_.has(listenerObj, eventCode)) {
            listenerObj[eventCode] = [];
        }
        listenerObj[eventCode].push(fn);
    }
}

Mixboard.getInstanceAsync = async function() {
    const mixboard = new Mixboard();
    await mixboard.initAsync();
    return mixboard;
};

module.exports = Mixboard;
