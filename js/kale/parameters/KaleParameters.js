const {MovingLinearParameter, IntLinearParameter, CycleParameter, MovingColorParameter, LinearParameter, ToggleParameter} = require('js/core/parameters/Parameter');
// const {MixtrackKnobs} = require('js/core/inputs/MixtrackConstants');
const PieceParameters = require('js/core/parameters/PieceParameters');
const tinycolor = require('tinycolor2');

const MAX_NUM_ROWS = 6;
const MAX_NUM_COLS = 12;

class KaleParameters extends PieceParameters {
    _declareParameters() {
        return {
            numRows: {
                type: IntLinearParameter,
                start: 3,
                range: [0, MAX_NUM_ROWS],
                listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
                monitorName: '# Rows',
            },
            numColumns: {
                type: IntLinearParameter,
                start: 8,
                range: [0, MAX_NUM_COLS],
                listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
                monitorName: '# Columns',
            },
            columnColorShift: {
                type: MovingLinearParameter,
                range: [-45, 45],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Column Color Shift',
                listenToLaunchpadKnob: [0, 0],
                variance: 1,
                autoupdateEveryNBeats: 1, // TODO
                autoupdateOnCue: true,
            },
            rowColorShift: {
                type: MovingLinearParameter,
                range: [-45, 45],
                start: 0,
                incrementAmount: 2.5,
                monitorName: 'Row Color Shift',
                listenToLaunchpadKnob: [0, 1],
                variance: 1,
                autoupdateEveryNBeats: 1, // TODO
                autoupdateOnCue: true,
            },
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
