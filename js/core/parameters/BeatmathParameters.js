var {MovingLinearParameter, LinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
var BeatmathTempo = require('js/core/parameters/BeatmathTempo');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/core/parameters/BeatmathConstants');
var {mixboardFader, mixboardWheel, mixboardButton} = require('js/core/inputs/MixboardConstants');

class BeatmathParameters {
    constructor(mixboard, params) {
        this.tempo = new BeatmathTempo(mixboard, {
            bpm: 480,
            bpmMod: params.bpmMod,
        });

        this.width = new LinearParameter({
            range: [WIDTH_PX / 10, WIDTH_PX],
            start: WIDTH_PX,
        });
        this.width.listenToFader(mixboard, mixboardFader.L_PITCH_BEND);

        this.height = new LinearParameter({
            range: [HEIGHT_PX / 10, HEIGHT_PX],
            start: DESIRED_HEIGHT_PX,
        });
        this.height.listenToFader(mixboard, mixboardFader.R_PITCH_BEND);

        this.frameScaleLog2 = new MovingLinearParameter({
            range: [-2, -0.5],
            start: -1.5,
            variance: 0.015,
            autoupdate: 100,
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
            range: [0.5, 3],
            start: 1,
        });
        this.tiltCoefficient.listenToFader(mixboard, mixboardFader.L_GAIN);

        this.brightness = new LinearParameter({
            range: [0, 1],
            start: 1,
            incrementAmount: 0.05,
            monitorName: 'Brightness',
        });
        this.brightness.listenToIncrementButton(mixboard, mixboardButton.R_PITCH_BEND_PLUS);
        this.brightness.listenToDecrementButton(mixboard, mixboardButton.R_PITCH_BEND_MINUS);

        this.pixelPointiness = new LinearParameter({
            range: [0.45, 2.5],
            start: 1,
            incrementAmount: 0.05,
        });
        this.pixelPointiness.listenToWheel(mixboard, mixboardWheel.R_SELECT);
        this.pixelPointiness.listenToResetButton(mixboard, mixboardButton.R_EFFECT);
        this.pixelPointiness.addStatusLight(mixboard, mixboardButton.R_EFFECT, value => value !== 1);

        this.pixelSidedness = new LinearParameter({
            range: [2, 5],
            start: 4,
        });
        this.pixelSidedness.listenToIncrementButton(mixboard, mixboardButton.R_HOT_CUE_1);
        this.pixelSidedness.listenToDecrementButton(mixboard, mixboardButton.R_DELETE);
        this.pixelSidedness.addStatusLight(mixboard, mixboardButton.R_HOT_CUE_1, value => value >= 5 || value <= 2);
        this.pixelSidedness.addStatusLight(mixboard, mixboardButton.R_DELETE, value => value <= 3);
    }
}

module.exports = BeatmathParameters;
