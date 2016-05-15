const _ = require('underscore');
const {MovingLogarithmicParameter, LinearParameter, IntLinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
const BeatmathTempo = require('js/core/parameters/BeatmathTempo');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/core/parameters/BeatmathConstants');
const {MixtrackFaders, MixtrackWheels, MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadKnobOutputCodes} = require('js/core/inputs/LaunchpadConstants');

class BeatmathParameters {
    constructor(mixboard, params) {
        window.localStorage.clear();
        if (mixboard.isLaunchpad()) {
            _.times(3, row => _.times(8, column => {
                mixboard.clearLaunchpadLight(LaunchpadKnobOutputCodes[row][column]);
            }));
        }

        this.tempo = new BeatmathTempo(mixboard, {
            bpm: 120,
            bpmMod: params.bpmMod,
        });

        this.width = new LinearParameter({
            range: [WIDTH_PX / 10, WIDTH_PX],
            start: WIDTH_PX,
            monitorName: 'Frame Width',
        });
        if (mixboard.isLaunchpad()) {
            this.width.listenToLaunchpadKnob(mixboard, 1, 7);
        } else {
            this.width.listenToMixtrackFader(mixboard, MixtrackFaders.L_PITCH_BEND);
        }

        this.height = new LinearParameter({
            range: [HEIGHT_PX / 10, HEIGHT_PX],
            start: DESIRED_HEIGHT_PX,
            monitorName: 'Frame Height',
        });
        if (mixboard.isLaunchpad()) {
            this.height.listenToLaunchpadKnob(mixboard, 0, 7);
        } else {
            this.height.listenToMixtrackFader(mixboard, MixtrackFaders.R_PITCH_BEND);
        }

        this.frameScale = new MovingLogarithmicParameter({
            range: [0.25, 16],
            autoupdateRange: [0.25, 0.75],
            start: 1,
            variance: 0.015,
            monitorName: 'Frame Scale',
        });
        if (mixboard.isMixboardConnected()) {
            this.frameScale.listenForAutoupdateCue(mixboard, MixtrackButtons.L_CUE);
        }
        if (mixboard.isLaunchpad()) {
            this.frameScale.listenToLaunchpadFader(mixboard, 7, {addButtonStatusLight: true});
        } else {
            this.frameScale.listenToMixtrackFader(mixboard, MixtrackFaders.MASTER_GAIN);
        }
        this.tempo.addListener(() => {
            const nTicks = 1;
            const tick = this.tempo.getNumTicks();
            if (tick % (nTicks * this.tempo._bpmMod) === 0) {
                this.frameScale.update();
            }
        });

        this.frameRotation = new AngleParameter({
            start: 0,
            constrainTo: false,
            monitorName: 'Frame Rotation',
            tempo: this.tempo,
        });
        if (mixboard.isLaunchpad()) {
            this.frameRotation.listenToLaunchpadKnob(mixboard, 2, 7);
        } else {
            this.frameRotation.listenToMixtrackWheel(mixboard, MixtrackWheels.L_TURNTABLE);
            this.frameRotation.listenToSnapMixtrackButton(mixboard, MixtrackButtons.L_SCRATCH);
        }

        if (params.useColor || params.usePixels) {
            this.colorSpin = new AngleParameter({
                start: 0,
                monitorName: 'Color Spin',
            });
            if (mixboard.isLaunchpad()) {
                this.colorSpin.listenToLaunchpadKnob(mixboard, 2, 6);
            } else {
                this.colorSpin.listenToMixtrackWheel(mixboard, MixtrackWheels.R_TURNTABLE);
                this.colorSpin.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_SCRATCH);
            }
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

        if (params.usePixels) {
            this.pixelPointiness = new LinearParameter({
                range: [0.45, 2.5],
                start: 1,
                useStartAsMidpoint: true,
                incrementAmount: 0.05,
                monitorName: 'Pixel Pointiness',
            });
            if (mixboard.isLaunchpad()) {
                this.pixelPointiness.listenToLaunchpadKnob(mixboard, 1, 6);
            } else {
                this.pixelPointiness.listenToMixtrackWheel(mixboard, MixtrackWheels.R_SELECT);
                this.pixelPointiness.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_EFFECT);
                this.pixelPointiness.addMixtrackStatusLight(mixboard, MixtrackButtons.R_EFFECT, value => value !== 1);
            }

            this.pixelSidedness = new IntLinearParameter({
                range: [2, 6],
                start: 4,
                monitorName: 'Pixel Sidedness',
            });
            if (mixboard.isLaunchpad()) {
                this.pixelSidedness.listenToLaunchpadKnob(mixboard, 0, 6);
            } else {
                this.pixelSidedness.listenToIncrementMixtrackButton(mixboard, MixtrackButtons.R_HOT_CUE_1);
                this.pixelSidedness.listenToDecrementMixtrackButton(mixboard, MixtrackButtons.R_DELETE);
                this.pixelSidedness.addMixtrackStatusLight(mixboard, MixtrackButtons.R_HOT_CUE_1, value => value >= 5 || value <= 2);
                this.pixelSidedness.addMixtrackStatusLight(mixboard, MixtrackButtons.R_DELETE, value => value <= 3);
            }
        }
    }
}

module.exports = BeatmathParameters;
