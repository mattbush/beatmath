const tinycolor = require('tinycolor2');
const updateHue = require('js/core/outputs/updateHue');
const {MovingColorParameter, MovingLinearParameter, MovingAngleParameter, NegatedParameter} = require('js/core/parameters/Parameter');
const {runAtTimestamp, setTimeoutAsync} = require('js/core/utils/time');
const {lerp, posMod, modAndShiftToHalf} = require('js/core/utils/math');

const {CELL_SIZE, ENABLE_HUE, MAX_SIZE} = require('js/lattice/parameters/LatticeConstants');

class Influence {
    constructor({beatmathParameters, pieceParameters, startRow, startCol}) {
        this._beatmathParameters = beatmathParameters;
        this._pieceParameters = pieceParameters;

        this._colParameter = new MovingLinearParameter({
            range: [new NegatedParameter(pieceParameters.numColumns), pieceParameters.numColumns],
            variance: 0.25,
            startLerp: startCol,
        });

        this._rowParameter = new MovingLinearParameter({
            range: [new NegatedParameter(pieceParameters.numRows), pieceParameters.numRows],
            variance: 0.25,
            startLerp: startRow,
        });

        this._updatePerEachBeat = this._updatePerEachBeat.bind(this);
        this._updatePerEachBeat();
    }
    async _updatePerEachBeat() {
        runAtTimestamp(this._updatePerEachBeat, this._beatmathParameters.tempo.getNextTick());
        const refreshRate = this.getRefreshRate();
        for (let i = 0; i < 5; i++) {
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
        let mixCoefficient = this._pieceParameters.mixCoefficient.getValue();
        let distanceCoefficient = this._pieceParameters.distanceCoefficient.getValue();

        let dx = this._colParameter.getValue() - col;
        let dy = this._rowParameter.getValue() - row;
        let distance = Math.sqrt(dx * dx + dy * dy);
//            let mixAmount = 500 / (distance * 5 + 5);
        let mixAmount = ((120 - (distance / distanceCoefficient * 8)) * mixCoefficient) / 100;
        const pixelStateKey = this._getPixelStateKey();
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

class SizeInfluence extends Influence {
    constructor(params) {
        super(params);
        const min = params.min || 1;
        const max = params.max || MAX_SIZE;
        this._mainParameter = new MovingLinearParameter({
            range: [min, max],
            variance: (max - min) / 80,
            start: params.startValue,
        });
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return lerp(pixelParameter, influenceParameter, mixAmount);
    }
    getSize() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'size';
    }
}

class ApertureInfluence extends Influence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingLinearParameter({
            range: [0, 127],
            variance: 1.25,
            start: params.startValue,
        });
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return lerp(pixelParameter, influenceParameter, mixAmount);
    }
    getSize() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'aperture';
    }
}

class RotundityInfluence extends Influence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingLinearParameter({
            range: [0, 127],
            variance: 1.25,
            start: params.startValue,
        });
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return lerp(pixelParameter, influenceParameter, mixAmount);
    }
    getSize() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'rotundity';
    }
}

class RotationInfluence extends Influence {
    constructor(params) {
        super(params);
        this._mainParameter = new MovingAngleParameter({
            max: 1,
            variance: 0.1,
            start: params.startValue,
        });
        this._constrainTo360 = params.constrainTo360 !== undefined ? params.constrainTo360 : true;
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        const differenceWithin180 = modAndShiftToHalf(influenceParameter - pixelParameter, 360);
        const newAngle = lerp(pixelParameter, pixelParameter + differenceWithin180, mixAmount);
        return this._constrainTo360 ? posMod(newAngle, 360) : newAngle;
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
        this._lightNumber = params.lightNumber;
    }
    _mixByParameterType(pixelParameter, mixAmount) {
        const influenceParameter = this._mainParameter.getValue();
        return tinycolor.mix(pixelParameter, influenceParameter, mixAmount * 100);
    }
    update() {
        super.update();
        if (ENABLE_HUE) {
            updateHue(this._lightNumber, this._mainParameter.getValue(), {briCoeff: 0.4});
        }
    }
    getColor() {
        return this._mainParameter.getValue();
    }
    _getPixelStateKey() {
        return 'color';
    }
}

module.exports = {ColorInfluence, RotationInfluence, SizeInfluence, ApertureInfluence, RotundityInfluence};
