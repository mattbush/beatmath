var tinycolor = require('tinycolor2');
var updateHue = require('js/update_hue');
var {ColorProperty} = require('js/moving_property');

const {ENABLE_HUE, COLOR_REFRESH_RATE, COLOR_MIX_COEFFICIENT} = require('js/brick_constants');

class BrickColor {
    constructor({startValue, index}) {
        this._property = new ColorProperty({
            max: 5,
            variance: 1,
            start: tinycolor(startValue),
        });
        this._index = index;

        setInterval(this.update.bind(this), COLOR_REFRESH_RATE);
    }
    getValue() {
        return this._property.value;
    }
    mix(otherColor) {
        return tinycolor.mix(otherColor, this.getValue(), COLOR_MIX_COEFFICIENT * 100);
    }
    update() {
        this._property.update();

        if (ENABLE_HUE) {
            updateHue(this._index, this._mainProperty.value);
        }
    }
}

module.exports = BrickColor;
