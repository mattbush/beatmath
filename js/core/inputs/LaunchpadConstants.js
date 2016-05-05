var LaunchpadButtons = {
    UP: 204, // actually 104, but special-case it
    DOWN: 205, // actually 105, but special-case it
    LEFT: 206, // actually 106, but special-case it
    RIGHT: 207, // actually 107, but special-case it

    DEVICE: 105,
    MUTE: 106,
    SOLO: 107,
    RECORD_ARM: 108,

    TRACK_FOCUS: [41, 42, 43, 44, 57, 58, 59, 60],
    TRACK_CONTROL: [73, 74, 75, 76, 89, 90, 91, 92],
};

var LaunchpadKnobInputCodes = [
    [13, 14, 15, 16, 17, 18, 19, 20],
    [29, 30, 31, 32, 33, 34, 35, 36],
    [49, 50, 51, 52, 53, 54, 55, 56],
];
var LaunchpadFaderInputCodes = [
    77, 78, 79, 80, 81, 82, 83, 84,
];

var LaunchpadKnobOutputCodes = [
    [13, 29, 45, 61, 77, 93, 109, 125],
    [14, 30, 46, 62, 78, 94, 110, 126],
    [15, 31, 47, 63, 79, 95, 111, 127],
];

module.exports = {
    LaunchpadButtons,
    LaunchpadKnobInputCodes,
    LaunchpadFaderInputCodes,
    LaunchpadKnobOutputCodes,
};
