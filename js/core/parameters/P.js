const {IntLinearParameter, MovingLinearParameter} = require('js/core/parameters/Parameter');

const P = {
    NumColumns: ({start, max}) => ({
        propertyName: 'numColumns',
        type: IntLinearParameter,
        range: [1, max],
        start: start,
        buildupStart: 1,
        listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
        monitorName: '# Columns',
    }),
    NumRows: ({start, max}) => ({
        propertyName: 'numRows',
        type: IntLinearParameter,
        range: [0, max],
        start: start,
        buildupStart: 1,
        listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
        monitorName: '# Rows',
    }),
    ColumnColorShift: ({range}) => ({
        propertyName: 'columnColorShift',
        type: MovingLinearParameter,
        range: [-range, range],
        start: 0,
        incrementAmount: 2.5,
        monitorName: 'Column Color Shift',
        listenToLaunchpadKnob: [0, 0],
        variance: 5,
        autoupdateEveryNBeats: 8,
        autoupdateOnCue: true,
        canSmoothUpdate: true,
    }),
    RowColorShift: ({range}) => ({
        propertyName: 'rowColorShift',
        type: MovingLinearParameter,
        range: [-range, range],
        start: 0,
        incrementAmount: 2.5,
        monitorName: 'Row Color Shift',
        listenToLaunchpadKnob: [0, 1],
        variance: 5,
        autoupdateEveryNBeats: 8,
        autoupdateOnCue: true,
        canSmoothUpdate: true,
    }),
};

module.exports = P;
