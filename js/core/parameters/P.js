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
};

module.exports = P;
