var tinycolor = require('tinycolor2');
var updateHue = require('./update_hue');
var {ColorProperty, LinearProperty} = require('./moving_property');

const {CELL_SIZE, NUM_ROWS, NUM_COLS, MIXER_REFRESH_RATE, MIX_COEFFICIENT, ENABLE_HUE} = require('./lattice_constants');

class Influence {
    constructor({startRow, startCol}) {
        this._listeners = [];

        this._colProperty = new LinearProperty({
            min: 0,
            max: NUM_COLS,
            variance: 0.25,
            start: startCol,
        });

        this._rowProperty = new LinearProperty({
            min: 0,
            max: NUM_ROWS,
            variance: 0.25,
            start: startRow,
        });

        this.update = this.update.bind(this);
    }
    addListener(fn) {
        this._listeners.push(fn);
    }
    mix(pixelState, row, col) {
        let dx = this._colProperty.value - col;
        let dy = this._rowProperty.value - row;
        let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
        let mixAmount = ((120 - (distance * 8)) * MIX_COEFFICIENT) / 100;
        var pixelStateKey = this._getPixelStateKey();
        if (mixAmount > 0) {
            pixelState[pixelStateKey] = this._mixByPropertyType(pixelState[pixelStateKey], mixAmount);
        }
    }
    _getPixelStateKey() {
        throw new Error('abstract method');
    }
    _mixByPropertyType() {
        throw new Error('abstract method');
    }
    update() {
        setTimeout(this.update, MIXER_REFRESH_RATE);
        this._mainProperty.update();
        this._colProperty.update();
        this._rowProperty.update();
        for (let listener of this._listeners) {
            listener();
        }
    }
    getCol() {
        return this._colProperty.value;
    }
    getRow() {
        return this._rowProperty.value;
    }
    getColor() {
        return tinycolor('#999');
    }
    getSize() {
        return CELL_SIZE * 0.5;
    }
    getRotation() {
        return null;
    }
}

class LinearInfluence extends Influence {
    _mixByPropertyType(pixelProperty, mixAmount) {
        const influenceProperty = this._mainProperty.value;
        return mixAmount * influenceProperty + (1 - mixAmount) * pixelProperty;
    }
}

class SizeInfluence extends LinearInfluence {
    constructor(params) {
        super(params);
        this._mainProperty = new LinearProperty({
            min: 1,
            max: CELL_SIZE,
            variance: 0.25,
            start: params.startValue,
        });
    }
    getSize() {
        return this._mainProperty.value;
    }
    _getPixelStateKey() {
        return 'size';
    }
}

class RotationInfluence extends LinearInfluence {
    constructor(params) {
        super(params);
        this._mainProperty = new LinearProperty({
            min: -90,
            max: 90,
            variance: 0.25,
            start: params.startValue,
        });
    }
    getRotation() {
        return this._mainProperty.value;
    }
    _getPixelStateKey() {
        return 'rotation';
    }
}

class ColorInfluence extends Influence {
    constructor(params) {
        super(params);
        this._mainProperty = new ColorProperty({
            max: 5,
            variance: 1,
            start: params.startValue,
        });
        this._index = params.index;
    }
    _mixByPropertyType(pixelProperty, mixAmount) {
        const influenceProperty = this._mainProperty.value;
        return tinycolor.mix(pixelProperty, influenceProperty, mixAmount * 100);
    }
    update() {
        super.update();
        if (ENABLE_HUE) {
            updateHue(this._index, this._mainProperty.value);
        }
    }
    getColor() {
        return this._mainProperty.value;
    }
    _getPixelStateKey() {
        return 'color';
    }
}

module.exports = {ColorInfluence, RotationInfluence, SizeInfluence};
