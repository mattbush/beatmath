const {CycleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const P = require('js/core/parameters/P');

const MAX_NUM_ROWS = 6;
const MAX_NUM_COLS = 12;

class KaleParameters extends PieceParameters {
    _declareParameters() {
        return {
            0: P.NumColumns({start: 8, max: MAX_NUM_COLS}),
            1: P.NumRows({start: 3, max: MAX_NUM_ROWS}),
            2: P.ColumnColorShift({range: 45}),
            3: P.RowColorShift({range: 45}),
            6: P.CustomToggle({name: 'isInfinite', button: 0}),
            7: P.CustomToggle({name: 'cellSymmetry', button: 3, start: true}),
            4: P.TriangularGridPercent({start: 1, inputPosition: [2, 2]}),
            reflectionsPerCell: {
                type: CycleParameter,
                cycleValues: [1, 2, 4, 6],
                listenToDecrementAndIncrementLaunchpadButtons: 2,
                monitorName: '# Reflections',
            },
            5: P.BaseColor(),
        };
    }
}

module.exports = KaleParameters;
