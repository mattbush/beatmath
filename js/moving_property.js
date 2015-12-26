class MovingProperty {
    constructor({min, max, variance, start}) {
        this._min = min;
        this._max = max;
        this._variance = variance;
        this.value = start;
        this._speed = 0;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        this._updateProperty();
    }
    _updateProperty() {
        throw new Error('abstract method');
    }
}

class ColorProperty extends MovingProperty {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this.value = this.value.spin(this._speed);
    }
}

class AngleProperty extends MovingProperty {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this.value = (this.value + this._speed + 360) % 360;
    }
}

class LinearProperty extends MovingProperty {
    _updateProperty() {
        var next = this.value + this._speed;
        if (next > this._max || next < this._min) {
            this._speed *= -0.5;
        } else {
            this.value += this._speed;
        }
    }
}

module.exports = {ColorProperty, AngleProperty, LinearProperty};
