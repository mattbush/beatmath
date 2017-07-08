const {CycleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');
const tinycolor = require('tinycolor2');
const _ = require('lodash');
const {ENABLE_HUE} = require('js/lattice/parameters/LatticeConstants');
const updateHue = require('js/core/outputs/updateHue');
const {NUM_LIGHTS} = require('js/hue_constants');

const MAX_NUM_ROWS = 7;
const MAX_NUM_COLS = 15;

class KaleParameters extends PieceParameters {
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
            ...P.NumColumns({start: 15, max: MAX_NUM_COLS}),
            ...P.NumRows({start: 3, max: MAX_NUM_ROWS}),
            ...P.ColumnColorShift({range: 45}),
            ...P.RowColorShift({range: 45}),
            ...P.CustomToggle({name: 'isInfinite', button: 0}),
            ...P.CustomToggle({name: 'cellSymmetry', button: 3, start: false}),
            ...P.TriangularGridPercent({start: 1, inputPosition: [2, 2]}),
            reflectionsPerCell: {
                type: CycleParameter,
                cycleValues: [2, 4, 6],
                listenToDecrementAndIncrementLaunchpadButtons: 2,
                monitorName: '# Reflections',
            },
            ...P.BaseColor(),
        };
    }
}

module.exports = KaleParameters;
