var tinycolor = require('tinycolor2');
var updateHue = require('./update_hue');
var {ColorProperty, AngleProperty} = require('./moving_property');

const {ENABLE_HUE, COLOR_REFRESH_RATE, POSITION_REFRESH_RATE, POSITION_SPEED, COLOR_MIX_COEFFICIENT} = require('./brick_constants');

const DEG_TO_RAD = Math.PI / 180;
const INV_SQRT_3 = 1 / Math.sqrt(3);

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
            max: 1,
            variance: 0.1,
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
    getDistance(item) {
        var dx = (item.x * INV_SQRT_3) - this._x;
        var dy = item.y - this._y;
        return dx * dx + dy * dy;
    }
    update() {
        this._property.update();
        var dx = POSITION_SPEED * Math.cos(this._property.value * DEG_TO_RAD);
        var dy = POSITION_SPEED * Math.sin(this._property.value * DEG_TO_RAD);
        this._x += dx;
        this._y += dy;
    }
}

module.exports = {BrickColor, BrickPosition};
