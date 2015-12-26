var tinycolor = require('tinycolor2');
var updateHue = require('./update_hue');
var {ColorProperty, LinearProperty} = require('./moving_property');

const {CELL_SIZE, NUM_ROWS, NUM_COLS, MIXER_REFRESH_RATE, MIX_COEFFICIENT, ENABLE_HUE} = require('./colors_constants');

class Influence {
    constructor({index, propertyType, startRow, startCol, startValue}) {
        this._propertyType = propertyType;
        this._index = index;
        this._listeners = [];

        this._colProperty = new LinearProperty({
            type: 'linear',
            min: 0,
            max: NUM_COLS,
            variance: 0.25,
            start: startCol,
        });

        this._rowProperty = new LinearProperty({
            type: 'linear',
            min: 0,
            max: NUM_ROWS,
            variance: 0.25,
            start: startRow,
        });

        this._mainProperty = new (propertyType === 'color' ? ColorProperty : LinearProperty)({
            min: {size: 1, rotation: -90}[propertyType],
            max: {size: CELL_SIZE, rotation: 90, color: 5}[propertyType],
            variance: {size: 0.25/* TODO: vary with cell size */, rotation: 0.25, color: 1}[propertyType],
            start: startValue,
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
        if (mixAmount > 0) {
            pixelState[this._propertyType] = this._mixByPropertyType(pixelState[this._propertyType], mixAmount);
        }
    }
    _mixByPropertyType(pixelProperty, mixAmount) {
        const influenceProperty = this._mainProperty.value;
        switch (this._propertyType) {
            case 'size':
            case 'rotation': /* TODO */
                return mixAmount * influenceProperty + (1 - mixAmount) * pixelProperty;
            case 'color':
                return tinycolor.mix(pixelProperty, influenceProperty, mixAmount * 100);
            default:
                throw Error();
        }
    }
    update() {
        setTimeout(this.update, MIXER_REFRESH_RATE);
        this._mainProperty.update();
        this._colProperty.update();
        this._rowProperty.update();
        for (let listener of this._listeners) {
            listener();
        }
        if (ENABLE_HUE && this._propertyType === 'color') {
            updateHue(this._index, this._mainProperty.value);
        }
    }
    getCol() {
        return this._colProperty.value;
    }
    getRow() {
        return this._rowProperty.value;
    }
    getColor() {
        return this._propertyType === 'color' ? this._mainProperty.value : tinycolor('#999');
    }
    getSize() {
        return this._propertyType === 'size' ? this._mainProperty.value : CELL_SIZE * 0.5;
    }
    getRotation() {
        return this._propertyType === 'rotation' ? this._mainProperty.value : null;
    }
}

module.exports = Influence;
