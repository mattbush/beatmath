const {ToggleParameter, LinearParameter, IntLinearParameter, MovingLinearParameter, MovingColorParameter} = require('js/core/parameters/Parameter');
const tinycolor = require('tinycolor2');

function camelCaseToHumanReadable(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/([A-Z])/g, ' $1');
}

const P = {
    NumColumns: ({start, max}) => ({numColumns: {
        type: IntLinearParameter,
        range: [1, max],
        start: start,
        buildupStart: 1,
        listenToLaunchpadFader: [0, {addButtonStatusLight: true}],
        monitorName: '# Columns',
    }}),
    NumRows: ({start, max}) => ({numRows: {
        type: IntLinearParameter,
        range: [0, max],
        start: start,
        buildupStart: 1,
        listenToLaunchpadFader: [1, {addButtonStatusLight: true}],
        monitorName: '# Rows',
    }}),
    ColumnColorShift: ({range}) => ({columnColorShift: {
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
    }}),
    RowColorShift: ({range}) => ({rowColorShift: {
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
    }}),
    TriangularGridPercent: ({start = 0, inputPosition}) => ({triangularGridPercent: {
        type: LinearParameter,
        range: [0, 1],
        start: start, buildupStart: 0,
        listenToLaunchpadKnob: inputPosition,
        monitorName: 'Triangle Grid %',
    }}),
    BorderRadiusPercent: ({start = 0, autoupdateMax = 1} = {}) => ({borderRadiusPercent: {
        type: MovingLinearParameter,
        range: [0, 1],
        autoupdateRange: [0, autoupdateMax],
        start: start,
        listenToLaunchpadKnob: [0, 4],
        variance: 0.01,
        monitorName: 'Roundness %',
        autoupdateEveryNBeats: 2,
        autoupdateOnCue: true,
    }}),
    BaseColor: () => ({baseColor: {
        type: MovingColorParameter,
        start: tinycolor('#5ff'),
        max: 5,
        variance: 1,
        autoupdate: 1000,
    }}),
    CustomToggle: ({name, button, start = false}) => ({[name]: {
        type: ToggleParameter,
        start: start,
        listenToLaunchpadButton: button,
        monitorName: camelCaseToHumanReadable(name) + '?',
    }}),
    CustomPercent: ({name, inputPosition, start = 0, buildupStart = 0}) => ({[name]: {
        type: LinearParameter,
        range: [0, 1],
        start: start, buildupStart: buildupStart,
        monitorName: camelCaseToHumanReadable(name).replace('Percent', '%'),
        ...(Array.isArray(inputPosition) ?
            {listenToLaunchpadKnob: inputPosition} :
            {listenToLaunchpadFader: [inputPosition.fader, {addButtonStatusLight: true}]}
        ),
    }}),
};

module.exports = P;
