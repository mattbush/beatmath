var {LinearParameter, AngleParameter, CycleParameter, ToggleParameter} = require('js/parameters/Parameter');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants');
var {mixboardFader, mixboardWheel, mixboardButton} = require('js/inputs/MixboardConstants');

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

        this.brightness = new LinearParameter({
            min: 0,
            max: 1,
            start: 1,
            incrementAmount: 0.05,
        });
        this.brightness.listenToIncrementButton(mixboard, mixboardButton.R_CUE);
        this.brightness.listenToDecrementButton(mixboard, mixboardButton.R_SYNC);

        this.pixelPointiness = new LinearParameter({
            min: 0.45,
            max: 2.5,
            start: 1,
            incrementAmount: 0.05,
        });
        this.pixelPointiness.listenToWheel(mixboard, mixboardWheel.R_SELECT);
        this.pixelPointiness.listenToResetButton(mixboard, mixboardButton.R_EFFECT);

        this.pixelSidedness = new CycleParameter({
            cycleValues: [4, 3],
        });
        this.pixelSidedness.listenToCycleButton(mixboard, mixboardButton.R_HOT_CUE_1);

        this.shouldStrokePixels = new ToggleParameter({
            cycleValues: [4, 3],
        });
        this.shouldStrokePixels.listenToButton(mixboard, mixboardButton.R_DELETE);
    }
}

module.exports = BeatmathParameters;
