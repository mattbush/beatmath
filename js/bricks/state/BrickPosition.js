const {POSITION_REFRESH_RATE, POSITION_SPEED} = require('js/bricks/parameters/BricksConstants');

const DEG_TO_RAD = Math.PI / 180;
const INV_SQRT_3 = 1 / Math.sqrt(3);

class BrickPosition {
    constructor(bricksParameters) {
        this._bricksParameters = bricksParameters;

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
        const dx = (item.x * INV_SQRT_3) - this._x;
        const dy = item.y - this._y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    update() {
        this._bricksParameters.motionAngle.update();
        const angle = this._bricksParameters.motionAngle.getValue();
        const dx = POSITION_SPEED * Math.cos(angle * DEG_TO_RAD);
        const dy = POSITION_SPEED * Math.sin(angle * DEG_TO_RAD);
        this._x += dx;
        this._y += dy;
    }
}

module.exports = BrickPosition;
