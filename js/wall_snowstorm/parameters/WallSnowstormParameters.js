const _ = require('lodash');
const {LinearParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const {NUM_LIGHTS} = require('js/hue_constants');
const tinycolor = require('tinycolor2');

class WallSnowstormParameters extends PieceParameters {
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
            columnDelayLimit: {
                type: LinearParameter,
                range: [1, 8],
                start: 3,
                listenToLaunchpadFader: [3, {addButtonStatusLight: true}],
                monitorName: 'Column delay limit',
            },
            delayPerColumn: {
                type: LinearParameter,
                range: [-4, 4],
                start: 0.16,
                listenToLaunchpadFader: [2, {addButtonStatusLight: true}],
                monitorName: 'Delay per column',
            },
            delayPerRow: {
                type: LinearParameter,
                range: [0, 2],
                start: 0.8,
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: 'Delay per row',
            },
            transitionTime: {
                type: LinearParameter,
                range: [0, 3],
                start: 1.6,
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: 'Transition time',
            },
        };
    }
}

module.exports = WallSnowstormParameters;
