var tinycolor = require('tinycolor2');
var updateHue = require('js/update_hue');
var {MovingColorParameter} = require('js/parameters/MovingParameter');

const {ENABLE_HUE, COLOR_REFRESH_RATE, COLOR_MIX_COEFFICIENT} = require('js/brick_constants');

class BrickColor {
    constructor({startValue, index}) {
        this._parameter = new MovingColorParameter({
            max: 5,
            variance: 1,
            start: tinycolor(startValue),
        });
        this._index = index;

        setInterval(this.update.bind(this), COLOR_REFRESH_RATE);
    }
    getValue() {
        return this._parameter.getValue();
    }
    mix(otherColor) {
        return tinycolor.mix(otherColor, this.getValue(), COLOR_MIX_COEFFICIENT * 100);
    }
    update() {
        this._parameter.update();

        if (ENABLE_HUE) {
            updateHue(this._index, this._mainProperty.getValue());
        }
    }
}

module.exports = BrickColor;
