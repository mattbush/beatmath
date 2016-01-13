var mixboardButton = {
    L_SYNC: 64,
    L_CUE: 51,
    L_PLAY_PAUSE: 59,
    L_STUTTER: 74,

    R_SYNC: 71,
    R_CUE: 60,
    R_PLAY_PAUSE: 66,
    R_STUTTER: 76,

    L_TURNTABLE: 78,
    R_TURNTABLE: 77,
};

var mixboardFader = {
    L_GAIN: 8,
    R_GAIN: 9,
    CROSSFADER: 10,
    L_PITCH_BEND: 13,
    R_PITCH_BEND: 14,
    MASTER_GAIN: 23,
};

var mixboardKnob = {
    CUE_GAIN: 11,
    CUE_MIX: 12,
    L_TREBLE: 16,
    R_TREBLE: 17,
    L_MID: 18,
    R_MID: 19,
    L_BASS: 20,
    R_BASS: 21,
};

var mixboardWheel = {
    R_TURNTABLE: 24,
    L_TURNTABLE: 25,
    BROWSE: 26,
    L_SELECT: 27,
    L_CONTROL_1: 28,
    L_CONTROL_2: 29,
    R_SELECT: 30,
    R_CONTROL_1: 31,
    R_CONTROL_2: 32,
};

var mixboardWheelCoefficients = {
    [mixboardWheel.R_TURNTABLE]: 0.25,
    [mixboardWheel.L_TURNTABLE]: 0.25,
    [mixboardWheel.BROWSE]: 4,
    [mixboardWheel.L_SELECT]: 1,
    [mixboardWheel.L_CONTROL_1]: 1,
    [mixboardWheel.L_CONTROL_2]: 1,
    [mixboardWheel.R_SELECT]: 1,
    [mixboardWheel.R_CONTROL_1]: 1,
    [mixboardWheel.R_CONTROL_2]: 1,
};

module.exports = {
    mixboardButton,
    mixboardWheel,
    mixboardFader,
    mixboardKnob,
    mixboardWheelCoefficients,
};
