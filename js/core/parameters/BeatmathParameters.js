const {MovingLinearParameter, LinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
const BeatmathTempo = require('js/core/parameters/BeatmathTempo');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/core/parameters/BeatmathConstants');
const {MixtrackFaders, MixtrackWheels, MixtrackButtons} = require('js/core/inputs/MixtrackConstants');

class BeatmathParameters {
    constructor(mixboard, params) {
        this.tempo = new BeatmathTempo(mixboard, {
            bpm: 120,
            bpmMod: params.bpmMod,
        });

        this.width = new LinearParameter({
            range: [WIDTH_PX / 10, WIDTH_PX],
            start: WIDTH_PX,
        });
        if (!mixboard.isLaunchpad()) {
            this.width.listenToMixtrackFader(mixboard, MixtrackFaders.L_PITCH_BEND);
        }

        this.height = new LinearParameter({
            range: [HEIGHT_PX / 10, HEIGHT_PX],
            start: DESIRED_HEIGHT_PX,
        });
        if (!mixboard.isLaunchpad()) {
            this.height.listenToMixtrackFader(mixboard, MixtrackFaders.R_PITCH_BEND);
        }

        this.frameScaleLog2 = new MovingLinearParameter({
            range: [-2, 4],
            autoupdateRange: [-2, -0.5],
            start: 0,
            variance: 0.015,
        });
        if (!mixboard.isLaunchpad()) {
            this.frameScaleLog2.listenToMixtrackFader(mixboard, MixtrackFaders.MASTER_GAIN);
        }
        if (mixboard.isMixboardConnected()) {
            this.frameScaleLog2.listenForAutoupdateCue(mixboard, MixtrackButtons.L_CUE);
        }
        this.tempo.addListener(() => {
            const nTicks = 1;
            const tick = this.tempo.getNumTicks();
            if (tick % (nTicks * this.tempo._bpmMod) === 0) {
                this.frameScaleLog2.update();
            }
        });

        this.frameRotation = new AngleParameter({
            start: 0,
            constrainTo: false,
        });
        if (!mixboard.isLaunchpad()) {
            this.frameRotation.listenToMixtrackWheel(mixboard, MixtrackWheels.L_TURNTABLE);
            this.frameRotation.listenToSnapMixtrackButton(mixboard, MixtrackButtons.L_SCRATCH);
        }

        this.colorSpin = new AngleParameter({
            start: 0,
        });
        if (!mixboard.isLaunchpad()) {
            this.colorSpin.listenToMixtrackWheel(mixboard, MixtrackWheels.R_TURNTABLE);
            this.colorSpin.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_SCRATCH);
        }

        // todo move to anagramsParameters
        this.tiltCoefficient = new LinearParameter({
            range: [0.5, 3],
            start: 1,
        });
        if (!mixboard.isLaunchpad()) {
            this.tiltCoefficient.listenToMixtrackFader(mixboard, MixtrackFaders.L_GAIN);
        }

        this.brightness = new LinearParameter({
            range: [0, 1],
            start: 1,
            incrementAmount: 0.05,
            monitorName: 'Brightness',
        });
        if (!mixboard.isLaunchpad()) {
            this.brightness.listenToIncrementMixtrackButton(mixboard, MixtrackButtons.R_PITCH_BEND_PLUS);
            this.brightness.listenToDecrementMixtrackButton(mixboard, MixtrackButtons.R_PITCH_BEND_MINUS);
        }

        this.pixelPointiness = new LinearParameter({
            range: [0.45, 2.5],
            start: 1,
            incrementAmount: 0.05,
        });
        if (!mixboard.isLaunchpad()) {
            this.pixelPointiness.listenToMixtrackWheel(mixboard, MixtrackWheels.R_SELECT);
            this.pixelPointiness.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_EFFECT);
            this.pixelPointiness.addStatusLight(mixboard, MixtrackButtons.R_EFFECT, value => value !== 1);
        }

        this.pixelSidedness = new LinearParameter({
            range: [2, 5],
            start: 4,
        });
        if (!mixboard.isLaunchpad()) {
            this.pixelSidedness.listenToIncrementMixtrackButton(mixboard, MixtrackButtons.R_HOT_CUE_1);
            this.pixelSidedness.listenToDecrementMixtrackButton(mixboard, MixtrackButtons.R_DELETE);
            this.pixelSidedness.addStatusLight(mixboard, MixtrackButtons.R_HOT_CUE_1, value => value >= 5 || value <= 2);
            this.pixelSidedness.addStatusLight(mixboard, MixtrackButtons.R_DELETE, value => value <= 3);
        }
    }
}

module.exports = BeatmathParameters;
