const {CELL_SIZE} = require('./colors_constants');

const MIXER_REFRESH_RATE = 200;

class InfluenceProperty {
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

class Influence {
    constructor({refreshTime, mixCoefficient, propertyType, numRows, numCols, startRow, startCol, startValue}) {
        this._refreshTime = refreshTime;
        this._mixCoefficient = mixCoefficient;
        this._listeners = [];

        this._columnProperty = new InfluenceProperty({
            type: 'linear',
            min: 0,
            max: numCols,
            variance: 0.25,
            start: startCol,
        });

        this._rowProperty = new InfluenceProperty({
            type: 'linear',
            min: 0,
            max: numRows,
            variance: 0.25,
            start: startRow,
        });

        this._mainProperty = new InfluenceProperty({
            type: {size: 'linear', color: 'color', rotation: 'linear'}[propertyType],
            min: {size: 1, rotation: -90}[propertyType],
            max: {size: CELL_SIZE, rotation: 90, color: 5}[propertyType],
            variance: {size: 0.25 /* TODO: vary with cell size */, rotation: 0.25, color: 1}[propertyType],
            start: startValue,
        });

        this.update = this.update.bind(this);
    }
    addListener(fn) {
        this._listeners.push(fn);
    }
    mix(pixelProperty, row, col) {
        let dx = this._columnProperty.value - col;
        let dy = this._rowProperty.value - row;
        let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
        let mixAmount = ((120 - (distance * 8)) * this._mixCoefficient) / 100;
        if (mixAmount > 0) {
            pixelProperty = this._mixByPropertyType(pixelProperty, mixAmount);
        }
        return pixelProperty;
    }
    _mixByPropertyType(pixelProperty, mixAmount) {
        const influenceProperty = this._mainProperty.value;
        switch (this._propertyType) {
            case 'size':
                return mixAmount * influenceProperty + (1 - mixAmount) * pixelProperty;
            case 'color':
            case 'rotation':
            default:
                throw Error();
        }
    }
    update() {
        setTimeout(this.update, MIXER_REFRESH_RATE);
        this._mainProperty.update();
        this._columnProperty.update();
        this._rowProperty.update();
        for (let listener of this._listeners) {
            listener();
        }
    }
}

module.exports = Influence;
