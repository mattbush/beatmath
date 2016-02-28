var tinycolor = require('tinycolor2');
var updateHue = require('js/core/outputs/updateHue');
var {MovingColorParameter, MovingLinearParameter, NegatedParameter} = require('js/core/parameters/Parameter');
var {runAtTimestamp, setTimeoutAsync} = require('js/core/utils/time');

const {CELL_SIZE, ENABLE_HUE, MAX_SIZE} = require('js/lattice/parameters/LatticeConstants');

class Influence {
    constructor({beatmathParameters, latticeParameters, startRow, startCol}) {
        this._beatmathParameters = beatmathParameters;
        this._latticeParameters = latticeParameters;

        this._colParameter = new MovingLinearParameter({
            min: new NegatedParameter(latticeParameters.numCols),
            max: latticeParameters.numCols,
            variance: 0.25,
            startLerp: startCol,
        });

        this._rowParameter = new MovingLinearParameter({
            min: new NegatedParameter(latticeParameters.numRows),
            max: latticeParameters.numRows,
            variance: 0.25,
            startLerp: startRow,
        });

        this._updatePerEachBeat = this._updatePerEachBeat.bind(this);
        this._updatePerEachBeat();
    }
    async _updatePerEachBeat() {
        runAtTimestamp(this._updatePerEachBeat, this._beatmathParameters.tempo.getNextTick());
        var refreshRate = this.getRefreshRate();
        for (var i = 0; i < 5; i++) {
            await setTimeoutAsync(refreshRate);
            this.update();
        }
    }
    getRefreshRate() {
        return this._beatmathParameters.tempo.getPeriod() / 5;
    }
    getColParameter() {
        return this._colParameter;
    }
    getRowParameter() {
        return this._rowParameter;
    }
    getMainParameter() {
        return this._mainParameter;
    }
    mix(pixelState, row, col) {
        let mixCoefficient = this._latticeParameters.mixCoefficient.getValue();
        let distanceCoefficient = this._latticeParameters.distanceCoefficient.getValue();

        let dx = this._colParameter.getValue() - col;
        let dy = this._rowParameter.getValue() - row;
        let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
        let mixAmount = ((120 - (distance / distanceCoefficient * 8)) * mixCoefficient) / 100;
        var pixelStateKey = this._getPixelStateKey();
        if (mixAmount > 0) {
            mixAmount = Math.min(mixAmount, 1);
            pixelState[pixelStateKey] = this._mixByParameterType(pixelState[pixelStateKey], mixAmount);
        }
    }
    _getPixelStateKey() {
        throw new Error('abstract method');
    }
    _mixByParameterType() {
        throw new Error('abstract method');
    }
    update() {
        this._mainParameter.update();
        this._colParameter.update();
        this._rowParameter.update();
    }
    getCol() {
        return this._colParameter.getValue();
    }
    getRow() {
        return this._rowParameter.getValue();
    }
    getColor() {
        return tinycolor('#999');
    }
    getSize() {
        return CELL_SIZE * 0.5;
    }
    getRotation() {
        return null;
    }
}

class LinearInfluence extends Influence {
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return mixAmount * influenceParameter + (1 - mixAmount) * pixelParameter;
    }
}

class SizeInfluence extends LinearInfluence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingLinearParameter({
            min: 1,
            max: MAX_SIZE,
            variance: 0.25,
            start: params.startValue,
        });
    }
    getSize() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'size';
    }
}

class RotationInfluence extends LinearInfluence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingLinearParameter({
            min: -90,
            max: 90,
            variance: 0.25,
            start: params.startValue,
        });
    }
    getRotation() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'rotation';
    }
}

class ColorInfluence extends Influence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingColorParameter({
            max: 5,
            variance: 1,
            start: params.startValue,
        });
        this._index = params.index;
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return tinycolor.mix(pixelParameter, influenceParameter, mixAmount * 100);
    }
    update() {
        super.update();
        if (ENABLE_HUE) {
            updateHue(this._index, this._mainParameter.getValue());
        }
    }
    getColor() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'color';
    }
}

module.exports = {ColorInfluence, RotationInfluence, SizeInfluence};
