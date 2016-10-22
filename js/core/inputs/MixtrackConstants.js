const MixtrackButtons = {
    L_SYNC: 64,
    L_CUE: 51,
    L_PLAY_PAUSE: 59,
    L_STUTTER: 74,

    R_SYNC: 71,
    R_CUE: 60,
    R_PLAY_PAUSE: 66,
    R_STUTTER: 76,

    L_KEYLOCK: 81,
    L_SCRATCH: 72,
    L_LITTLE_CUE: 101,
    L_LOAD: 75,

    R_KEYLOCK: 82,
    R_SCRATCH: 80,
    R_LITTLE_CUE: 102,
    R_LOAD: 52,

    BROWSE_BACK: 105,

    L_PITCH_BEND_MINUS: 67,
    L_PITCH_BEND_PLUS: 68,
    R_PITCH_BEND_MINUS: 69,
    R_PITCH_BEND_PLUS: 70,

    L_DELETE: 89,
    L_HOT_CUE_1: 90,
    L_HOT_CUE_2: 91,
    L_HOT_CUE_3: 92,
    L_EFFECT: 99,
    L_LOOP_MANUAL: 97,
    L_LOOP_IN: 83,
    L_LOOP_OUT: 84,
    L_LOOP_RELOOP: 85,

    R_DELETE: 93,
    R_HOT_CUE_1: 94,
    R_HOT_CUE_2: 95,
    R_HOT_CUE_3: 96,
    R_EFFECT: 100,
    R_LOOP_MANUAL: 98,
    R_LOOP_IN: 86,
    R_LOOP_OUT: 87,
    R_LOOP_RELOOP: 88,

    L_TURNTABLE: 78,
    R_TURNTABLE: 77,
};

const MixtrackFaders = {
    L_GAIN: 8,
    R_GAIN: 9,
    CROSSFADER: 10,
    L_PITCH_BEND: 13,
    R_PITCH_BEND: 14,
    MASTER_GAIN: 23,
};

const MixtrackKnobs = {
    CUE_GAIN: 11,
    CUE_MIX: 12,
    L_TREBLE: 16,
    R_TREBLE: 17,
    L_MID: 18,
    R_MID: 19,
    L_BASS: 20,
    R_BASS: 21,
};

const MixtrackWheels = {
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

const MixtrackWheelCoefficients = {
    [MixtrackWheels.R_TURNTABLE]: 0.25,
    [MixtrackWheels.L_TURNTABLE]: 0.25,
    [MixtrackWheels.BROWSE]: 1,
    [MixtrackWheels.L_SELECT]: 1,
    [MixtrackWheels.L_CONTROL_1]: 0.5,
    [MixtrackWheels.L_CONTROL_2]: 0.5,
    [MixtrackWheels.R_SELECT]: 1,
    [MixtrackWheels.R_CONTROL_1]: 0.5,
    [MixtrackWheels.R_CONTROL_2]: 0.5,
};

module.exports = {
    MixtrackButtons,
    MixtrackWheels,
    MixtrackFaders,
    MixtrackKnobs,
    MixtrackWheelCoefficients,
};
