const {CycleParameter, MovingColorParameter, LinearParameter, ToggleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const tinycolor = require('tinycolor2');
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
            triangularGridPercent: {
                type: LinearParameter,
                range: [0, 1],
                start: 1, buildupStart: 0,
                listenToLaunchpadKnob: [2, 2],
                monitorName: 'Triangle Grid %',
            },
            reflectionsPerCell: {
                type: CycleParameter,
                cycleValues: [1, 2, 4, 6],
                listenToDecrementAndIncrementLaunchpadButtons: 2,
                monitorName: '# Reflections',
            },
            baseColor: {
                type: MovingColorParameter,
                start: tinycolor('#5ff'),
                max: 6,
                variance: 1.5,
                autoupdate: 2000,
            },
        };
    }
}

module.exports = KaleParameters;
