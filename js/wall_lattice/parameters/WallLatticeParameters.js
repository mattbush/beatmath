const _ = require('lodash');
const {Parameter, LinearParameter} = require('js/core/parameters/Parameter');
const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const {NUM_LIGHTS} = require('js/hue_constants');
const tinycolor = require('tinycolor2');

class WallLatticeParameters extends PieceParameters {
    constructor(...args) {
        super(...args);
        if (ENABLE_HUE) {
            _.times(NUM_LIGHTS, lightNumber => {
                updateHue(lightNumber, tinycolor('#000'));
            });
        }
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
                start: 8,
            },
            0: P.CustomPercent({name: 'wavePercent', inputPosition: {fader: 5}}),
        };
    }
}

module.exports = WallLatticeParameters;
