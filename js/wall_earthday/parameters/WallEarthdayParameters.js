const _ = require('lodash');
const {Parameter, LinearParameter, NegatedParameter, LogarithmicParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const {NUM_LIGHTS} = require('js/hue_constants');
const tinycolor = require('tinycolor2');

class WallEarthdayParameters extends PieceParameters {
    constructor(...args) {
        super(...args);

        this.influenceMinColumn = new NegatedParameter(this.numColumns);
        this.influenceMaxColumn = this.numColumns;
        this.influenceMinRow = new NegatedParameter(this.numRows);
        this.influenceMaxRow = this.numRows;

        this._currentTickRotationAngle = 0;

        if (ENABLE_HUE) {
            _.times(NUM_LIGHTS, lightNumber => {
                updateHue(lightNumber, tinycolor('#000'));
            });
        }

        this._beatmathParameters.tempo.addListener(this._updateRotation.bind(this));
    }
    _declareParameters() {
        return {
            mixCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1.2,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 0],
                listenToMixtrackKnob: MixtrackKnobs.L_BASS,
                monitorName: 'Mix Coeff',
            },
            distanceCoefficient: {
                type: LinearParameter,
                range: [0.2, 3],
                start: 1.0,
                useStartAsMidpoint: true,
                listenToLaunchpadKnob: [1, 1],
                listenToMixtrackKnob: MixtrackKnobs.R_BASS,
                monitorName: 'Distance Coeff',
            },
            numColumns: {
                type: Parameter,
                start: 38,
            },
            numRows: {
                type: Parameter,
                start: 12,
            },
            ...P.CustomToggle({name: 'spherical', button: 0, start: true}),
            scale: {
                type: LogarithmicParameter,
                range: [1, 16],
                start: 3.1,
                listenToLaunchpadFader: [7, {addButtonStatusLight: true}],
                monitorName: 'Scale',
            },
            tilt: {
                type: LinearParameter,
                range: [-90, 90],
                start: 20,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: 'Tilt',
            },
            rotationSpeed: {
                type: LinearParameter,
                range: [2, 45],
                start: 10,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: 'Rotation Speed',
            },
        };
    }
    _updateRotation() {
        this._currentTickRotationAngle += this.rotationSpeed.getValue();
    }
    getRotation() {
        const progressTowardsNextTick = this._beatmathParameters.tempo.getProgressTowardsNextTick();
        return this._currentTickRotationAngle + (this.rotationSpeed.getValue() * progressTowardsNextTick);
    }
}

module.exports = WallEarthdayParameters;
