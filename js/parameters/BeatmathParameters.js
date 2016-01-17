var {LinearParameter, AngleParameter} = require('js/parameters/Parameter');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants');
var {mixboardFader, mixboardWheel, mixboardButton} = require('js/inputs/MixboardConstants');

class BeatmathParameters {
    constructor(mixboard) {
        this.width = new LinearParameter({
            min: WIDTH_PX / 10,
            max: WIDTH_PX,
            start: WIDTH_PX,
        });
        this.width.listenToKnob(mixboard, mixboardFader.L_PITCH_BEND);

        this.height = new LinearParameter({
            min: HEIGHT_PX / 10,
            max: HEIGHT_PX,
            start: DESIRED_HEIGHT_PX,
        });
        this.height.listenToKnob(mixboard, mixboardFader.R_PITCH_BEND);

        this.frameScaleLog2 = new LinearParameter({
            min: -2,
            max: 4,
            start: 0,
        });
        this.frameScaleLog2.listenToFader(mixboard, mixboardFader.MASTER_GAIN);

        this.frameRotation = new AngleParameter({
            start: 0,
            constrainTo360: false,
        });
        this.frameRotation.listenToWheel(mixboard, mixboardWheel.L_TURNTABLE);
        this.frameRotation.listenToSnapButton(mixboard, mixboardButton.L_SCRATCH);
    }
}

module.exports = BeatmathParameters;
