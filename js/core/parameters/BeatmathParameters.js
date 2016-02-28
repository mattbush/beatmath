var {LinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
var TempoParameter = require('js/core/parameters/TempoParameter');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/core/parameters/BeatmathConstants');
var {mixboardFader, mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');

class BeatmathParameters {
    constructor(mixboard) {
        this.width = new LinearParameter({
            min: WIDTH_PX / 10,
            max: WIDTH_PX,
            start: WIDTH_PX,
        });
        this.width.listenToFader(mixboard, mixboardFader.L_PITCH_BEND);

        this.height = new LinearParameter({
            min: HEIGHT_PX / 10,
            max: HEIGHT_PX,
            start: DESIRED_HEIGHT_PX,
        });
        this.height.listenToFader(mixboard, mixboardFader.R_PITCH_BEND);

        this.frameScaleLog2 = new LinearParameter({
            min: -2,
            max: 4,
            start: 0,
        });
        this.frameScaleLog2.listenToFader(mixboard, mixboardFader.MASTER_GAIN);

        this.frameRotation = new AngleParameter({
            start: 0,
            constrainTo: false,
        });
        this.frameRotation.listenToWheel(mixboard, mixboardWheel.L_TURNTABLE);
        this.frameRotation.listenToSnapButton(mixboard, mixboardButton.L_SCRATCH);

        this.colorSpin = new AngleParameter({
            start: 0,
        });
        this.colorSpin.listenToWheel(mixboard, mixboardWheel.R_TURNTABLE);
        this.colorSpin.listenToResetButton(mixboard, mixboardButton.R_SCRATCH);

        // todo move to anagramsParameters
        this.tiltCoefficient = new LinearParameter({
            min: 0.5,
            max: 3,
            start: 1,
        });
        this.tiltCoefficient.listenToFader(mixboard, mixboardFader.L_GAIN);

        this.brightness = new LinearParameter({
            min: 0,
            max: 1,
            start: 1,
            incrementAmount: 0.05,
            monitorName: 'Brightness',
        });
        this.brightness.listenToIncrementButton(mixboard, mixboardButton.R_PITCH_BEND_PLUS);
        this.brightness.listenToDecrementButton(mixboard, mixboardButton.R_PITCH_BEND_MINUS);

        this.pixelPointiness = new LinearParameter({
            min: 0.45,
            max: 2.5,
            start: 1,
            incrementAmount: 0.05,
        });
        this.pixelPointiness.listenToWheel(mixboard, mixboardWheel.R_SELECT);
        this.pixelPointiness.listenToResetButton(mixboard, mixboardButton.R_EFFECT);
        this.pixelPointiness.addStatusLight(mixboard, mixboardButton.R_EFFECT, value => value !== 1);

        this.pixelSidedness = new LinearParameter({
            min: 2,
            max: 5,
            start: 4,
        });
        this.pixelSidedness.listenToIncrementButton(mixboard, mixboardButton.R_HOT_CUE_1);
        this.pixelSidedness.listenToDecrementButton(mixboard, mixboardButton.R_DELETE);
        this.pixelSidedness.addStatusLight(mixboard, mixboardButton.R_HOT_CUE_1, value => value >= 5 || value <= 2);
        this.pixelSidedness.addStatusLight(mixboard, mixboardButton.R_DELETE, value => value <= 3);

        this.tempo = new TempoParameter({
            interval: 1000,
        });
    }
}

module.exports = BeatmathParameters;
