const {CycleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');
// const _ = require('lodash');

const MAX_NUM_ROWS = 6;
const MAX_NUM_COLS = 12;

class KaleParameters extends PieceParameters {
    _declareParameters() {
        return {
            ...P.NumColumns({start: 2, max: MAX_NUM_COLS}),
            ...P.NumRows({start: 1, max: MAX_NUM_ROWS}),
            ...P.ColumnColorShift({range: 45}),
            ...P.RowColorShift({range: 45}),
            ...P.CustomToggle({name: 'isInfinite', button: 0}),
            ...P.CustomToggle({name: 'cellSymmetry', button: 3, start: true}),
            ...P.TriangularGridPercent({start: 1, inputPosition: [2, 2]}),
            reflectionsPerCell: {
                type: CycleParameter,
                cycleValues: [1, 2, 4, 6],
                listenToDecrementAndIncrementLaunchpadButtons: 2,
                monitorName: '# Reflections',
            },
            ...P.BaseColor(),
        };
    }
}

module.exports = KaleParameters;
