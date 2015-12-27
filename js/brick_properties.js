var tinycolor = require('tinycolor2');
var updateHue = require('./update_hue');
var {ColorProperty, AngleProperty} = require('./moving_property');

const {ENABLE_HUE, COLOR_REFRESH_RATE, POSITION_REFRESH_RATE, POSITION_SPEED, COLOR_MIX_COEFFICIENT} = require('./brick_constants');

const DEG_TO_RAD = 180 / Math.PI;

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

class BrickPosition {
    constructor() {
        this._property = new AngleProperty({
            max: 5,
            variance: 0.5,
            start: 0,
        });

        this._x = 0;
        this._y = 0;

        setInterval(this.update.bind(this), POSITION_REFRESH_RATE);
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    update() {
        this._property.update();
        var dx = POSITION_SPEED * Math.cos(this._property * DEG_TO_RAD);
        var dy = POSITION_SPEED * Math.sin(this._property * DEG_TO_RAD);
        this._x += dx;
        this._y += dy;
    }
}

module.exports = {BrickColor, BrickPosition};
