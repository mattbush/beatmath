var {AngleProperty} = require('js/moving_property');

const {POSITION_REFRESH_RATE, POSITION_SPEED} = require('js/brick_constants');

const DEG_TO_RAD = Math.PI / 180;
const INV_SQRT_3 = 1 / Math.sqrt(3);

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
        return Math.sqrt(dx * dx + dy * dy);
    }
    update() {
        this._property.update();
        var dx = POSITION_SPEED * Math.cos(this._property.value * DEG_TO_RAD);
        var dy = POSITION_SPEED * Math.sin(this._property.value * DEG_TO_RAD);
        this._x += dx;
        this._y += dy;
    }
}

module.exports = BrickPosition;
