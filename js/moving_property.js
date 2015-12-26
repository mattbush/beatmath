class MovingProperty {
    constructor({type, min, max, variance, start}) {
        this._type = type;
        this._min = min;
        this._max = max;
        this._variance = variance;
        this.value = start;
        this._speed = 0;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;

        switch (this._type) {
            case 'linear':
                var next = this.value + this._speed;
                if (next > this._max || next < this._min) {
                    this._speed *= -0.5;
                } else {
                    this.value += this._speed;
                }
                break;

            case 'circular':
                // TODO
                break;

            case 'color':
                if (Math.abs(this._speed) > this._max) {
                    this._speed *= 0.5;
                }
                this.value = this.value.spin(this._speed);
                break;

            default:
                throw Error();
        }
    }
}

module.exports = MovingProperty;
