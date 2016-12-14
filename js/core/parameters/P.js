const {IntLinearParameter} = require('js/core/parameters/Parameter');

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
};

module.exports = P;
