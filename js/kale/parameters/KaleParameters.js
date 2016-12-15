const {CycleParameter, ToggleParameter} = require('js/core/parameters/Parameter');
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
            isInfinite: {
                type: ToggleParameter,
                start: false,
                listenToLaunchpadButton: 0,
                monitorName: 'Infinite?',
            },
            cellSymmetry: {
                type: ToggleParameter,
                start: true,
                listenToLaunchpadButton: 3,
                monitorName: 'Cell Symmetry',
            },
            4: P.TriangularGridPercent({start: 1, knobPosition: [2, 2]}),
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
