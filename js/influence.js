class InfluenceProperty {
    constructor({type, min, max, start}) {
        this._type = type;
        this._min = min;
        this._max = max;
        this.value = start;
        this._speed = 0;
    }
    update() {
        switch (this._type) {
            case 'linear':
                var next = this.value + this._speed;
                if (next > this._max || next < this._min) {
                    this._speed *= -0.5;
                } else {
                    this.value += this._speed;
                }

        }
    }
}

class Influence {
    constructor({refreshTime, mixCoefficient, propertyType, numRows, numCols, startRow, startCol, startValue}) {
        this._refreshTime = refreshTime;
        this._mixCoefficient = mixCoefficient;

        this._columnProperty = new InfluenceProperty({
            type: 'linear',
            min: 0,
            max: numCols,
            start: startCol,
        });

        this._rowProperty = new InfluenceProperty({
            type: 'linear',
            min: 0,
            max: numRows,
            start: startRow,
        });

        this._mainProperty = new InfluenceProperty({
            type: {size: 'linear', color: 'color', rotation: 'circular'}[propertyType],
            min: 0,
            max: {size: 20, rotation: 360}[propertyType],
            start: startValue,
        });

        this.update = this.update.bind(this);
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

    }
}

window.Influence = Influence;
