const {Parameter, ToggleParameter, CycleParameter, MovingLinearParameter, LogarithmicParameter, MovingLogarithmicParameter, LinearParameter, IntLinearParameter, AngleParameter} = require('js/core/parameters/Parameter');
const BeatmathTempo = require('js/core/parameters/BeatmathTempo');
const {WIDTH_PX, HEIGHT_PX, DESIRED_HEIGHT_PX} = require('js/core/parameters/BeatmathConstants');
const {MixtrackFaders, MixtrackWheels, MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const {LaunchpadButtons} = require('js/core/inputs/LaunchpadConstants');
const MapperShape = require('js/mapper/parameters/MapperShape');

const BLESSED_LOCAL_STORAGE_KEYS = ['mapping', 'playaMapping', 'playaMapperParams'];

class BeatmathParameters {
    constructor(mixboard, params) {
        // clear all items except mapping
        for (let property in window.localStorage) {
            if (window.localStorage.hasOwnProperty(property) && !BLESSED_LOCAL_STORAGE_KEYS.includes(property)) {
                delete window.localStorage[property];
            }
        }
        if (mixboard.isLaunchpad()) {
            mixboard.resetLaunchpadLights();
        }

        window.addEventListener('storage', this._onStorage.bind(this));

        const existingMapping = JSON.parse(window.localStorage.getItem('mapping'));
        if (existingMapping) {
            this._mapperShapes = [];
            this._mapperMasks = [];
            for (let i = 0; i < existingMapping.length; i++) {
                const shape = new MapperShape({existingData: existingMapping[i]});
                if (shape.isMask()) {
                    this._mapperMasks.push(shape);
                } else {
                    this._mapperShapes.push(shape);
                }
            }
        }

        this._playaMapping = JSON.parse(window.localStorage.getItem('playaMapping'));

        this.tempo = new BeatmathTempo(mixboard, {
            bpm: 120,
            bpmMod: params.bpmMod,
        });

        this.width = new LinearParameter({
            range: [WIDTH_PX / 10, WIDTH_PX],
            start: WIDTH_PX,
            monitorName: 'Frame Width',
        });
        // if (mixboard.isLaunchpad()) {
        //     this.width.listenToLaunchpadKnob(mixboard, 1, 7);
        // } else {
        //     this.width.listenToMixtrackFader(mixboard, MixtrackFaders.L_PITCH_BEND);
        // }

        this.height = new LinearParameter({
            range: [HEIGHT_PX / 10, HEIGHT_PX],
            start: DESIRED_HEIGHT_PX,
            monitorName: 'Frame Height',
        });
        // if (mixboard.isLaunchpad()) {
        //     this.height.listenToLaunchpadKnob(mixboard, 0, 7);
        // } else {
        //     this.height.listenToMixtrackFader(mixboard, MixtrackFaders.R_PITCH_BEND);
        // }

        if (params.useFrame !== false) {
            this.frameScale = new LogarithmicParameter({
                range: [0.25, 16],
                start: 1,
                variance: 0.015,
                monitorName: 'Frame Scale',
            });
            if (mixboard.isLaunchpad()) {
                this.frameScale.listenToLaunchpadFader(mixboard, 7, {addButtonStatusLight: true});
            } else {
                this.frameScale.listenToMixtrackFader(mixboard, MixtrackFaders.MASTER_GAIN);
            }

            this.frameScaleAutoupdating = new MovingLogarithmicParameter({
                range: [0.5, 2],
                start: 1,
                variance: 0.015,
                monitorName: 'Scale Mod',
            });
            if (mixboard.isMixboardConnected()) {
                this.frameScaleAutoupdating.listenForAutoupdateCue(mixboard);
            }
            if (mixboard.isLaunchpad()) {
                this.frameScaleAutoupdating.listenToLaunchpadFader(mixboard, 6, {addButtonStatusLight: true});
                this.tempo.addListener(() => {
                    const nTicks = 1;
                    const tick = this.tempo.getNumTicks();
                    if (tick % (nTicks * this.tempo._bpmMod) === 0) {
                        this.frameScaleAutoupdating.update();
                    }
                });
            }

            this.frameRotation = new AngleParameter({
                start: 0,
                constrainTo: false,
                monitorName: 'Frame Rotation',
                tempo: this.tempo,
            });
            if (mixboard.isLaunchpad()) {
                this.frameRotation.listenToLaunchpadKnob(mixboard, 2, 6); // was 2, 7
            } else {
                this.frameRotation.listenToMixtrackWheel(mixboard, MixtrackWheels.L_TURNTABLE);
                this.frameRotation.listenToSnapMixtrackButton(mixboard, MixtrackButtons.L_SCRATCH);
            }
        } else {
            this.frameScale = new Parameter({start: 1});
            this.frameScaleAutoupdating = new Parameter({start: 1});
            this.frameRotation = new Parameter({start: 0});
        }

        if (params.useColor || params.usePixels) {
            this.colorSpin = new AngleParameter({
                start: 0,
                monitorName: 'Color Spin',
            });
            // if (mixboard.isLaunchpad()) {
            //     this.colorSpin.listenToLaunchpadKnob(mixboard, 2, 6);
            // } else {
            //     this.colorSpin.listenToMixtrackWheel(mixboard, MixtrackWheels.R_TURNTABLE);
            //     this.colorSpin.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_SCRATCH);
            // }
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

        // const mappingModeCycleValues = ['off', 'onWithOneFrame', 'onWithFrames'];
        // if (params.hasSpecialMapping) {
        //     mappingModeCycleValues.push('onWithFramesSpecial');
        // }
        const mappingModeCycleValues = ['off', 'oneFramePerGroup'];
        if (params.canMapAcrossGroups) {
            mappingModeCycleValues.push('acrossGroups');
        }
        if (params.hasSpecialMapping) {
            mappingModeCycleValues.push('inFramesInGroups');
        }
        this.mappingMode = new CycleParameter({
            cycleValues: mappingModeCycleValues,
            monitorName: 'Mapping Mode',
        });
        this.mappingMode.listenToDecrementAndIncrementLaunchpadSideButtons(mixboard, LaunchpadButtons.LEFT, LaunchpadButtons.RIGHT);

        this.mirrorCanopies = new ToggleParameter({
            start: false,
            monitorName: 'Mirror Canopies',
        });
        this.mirrorCanopies.listenToLaunchpadSideButton(mixboard, LaunchpadButtons.DOWN);

        this.dropOriginPercent = new LinearParameter({
            range: [0, 1],
            start: 0,
            monitorName: 'Drop Origin %',
        });
        this.dropOriginPercent.listenToLaunchpadKnob(mixboard, 1, 7);

        if (params.usePixels) {
            this.pixelPointiness = new MovingLinearParameter({
                range: [0.45, 2.5],
                autoupdateRange: [0.45, 1.75],
                start: 1,
                useStartAsMidpoint: true,
                incrementAmount: 0.05,
                monitorName: 'Pixel Pointiness',
                variance: 0.05,
            });
            if (mixboard.isLaunchpad()) {
                this.pixelPointiness.listenToLaunchpadKnob(mixboard, 1, 6);
            } else {
                this.pixelPointiness.listenToMixtrackWheel(mixboard, MixtrackWheels.R_SELECT);
                this.pixelPointiness.listenToResetMixtrackButton(mixboard, MixtrackButtons.R_EFFECT);
                this.pixelPointiness.addMixtrackStatusLight(mixboard, MixtrackButtons.R_EFFECT, value => value !== 1);
            }
            if (mixboard.isMixboardConnected()) {
                this.pixelPointiness.listenForAutoupdateCue(mixboard);
            }
            this.tempo.addListener(() => {
                const nTicks = 1;
                const tick = this.tempo.getNumTicks();
                if (tick % (nTicks * this.tempo._bpmMod) === 0) {
                    this.pixelPointiness.update();
                }
            });

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
    mapMapperShapes(fn) {
        if (!this._mapperShapes) {
            return [];
        }
        return this._mapperShapes.map(fn);
    }
    mapPlayaMapperGroups(fn) {
        if (!this._playaMapping) {
            return [];
        }
        return this._playaMapping.groups.map(fn);
    }
    getPlayaMapperProjectionOffset() {
        if (!this._playaMapping) {
            return 0.5;
        }
        return this._playaMapping.projectorOffset;
    }
    mapMapperShapesInGroup(groupIndex, fn) {
        return this._playaMapping.groups[groupIndex].shapes.map(fn);
    }
    mapMapperMasks(fn) {
        if (!this._mapperMasks) {
            return [];
        }
        return this._mapperMasks.map(fn);
    }
    _onStorage(event) {
        if (event.key === 'pieceNameToLoad') {
            const path = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1);
            window.location = path + event.newValue;
        }
    }
    getFrameScale() {
        return this.frameScale.getValue() * this.frameScaleAutoupdating.getValue();
    }
}

module.exports = BeatmathParameters;
