class MovingParameter {
    constructor({min, max, variance, start}) {
        this._min = min;
        this._max = max;
        this._variance = variance;
        this._value = start;
        this._speed = 0;
    }
    getValue() {
        return this._value;
    }
    update() {
        this._speed += (Math.random() * this._variance * 2) - this._variance;
        this._updateProperty();
    }
    _updateProperty() {
        throw new Error('abstract method');
    }
}

class MovingColorParameter extends MovingParameter {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = this._value.spin(this._speed);
    }
}

class MovingAngleParameter extends MovingParameter {
    _updateProperty() {
        if (Math.abs(this._speed) > this._max) {
            this._speed *= 0.5;
        }
        this._value = (this._value + this._speed + 360) % 360;
    }
}

class MovingLinearParameter extends MovingParameter {
    _updateProperty() {
        var next = this._value + this._speed;
        if (next > this._max || next < this._min) {
            this._speed *= -0.5;
        } else {
            this._value += this._speed;
        }
    }
}

module.exports = {MovingColorParameter, MovingAngleParameter, MovingLinearParameter};
