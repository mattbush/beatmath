// const _ = require('lodash');
const {LinearParameter, IntLinearParameter, MovingColorParameter, LogarithmicParameter, MovingAngleParameter, MovingLogarithmicParameter} = require('js/core/parameters/Parameter'); // MovingLinearParameter
const {MixtrackButtons} = require('js/core/inputs/MixtrackConstants');
const tinycolor = require('tinycolor2');
const {posMod, lerp, xyRotatedAroundOriginWithAngle} = require('js/core/utils/math'); // posModAndBendToLowerHalf
const PieceParameters = require('js/core/parameters/PieceParameters');
const {arclerp} = require('js/core/utils/math');

class WallCircuitParameters extends PieceParameters {
    constructor(mixboard, beatmathParameters, channel) {
        super(mixboard, beatmathParameters, {channel});

        this._riseNumTicks = -channel * 4;
        this._channel = channel;

        beatmathParameters.tempo.addListener(this._incrementNumTicks.bind(this));
    }
    _declareParameters({channel}) {
        return {
            baseColor: {
                type: MovingColorParameter,
                start: tinycolor(['#8405F3', '#F405C3', '#F5B10F', '#00A093'][channel]),
                max: 5,
            },
            volume: {
                type: LinearParameter,
                range: [0, 2],
                start: channel === 0 ? 2 : 0,
                monitorName: `Ch ${channel} volume`,
                listenToLaunchpadKnob: [0, channel],
            },
            completeness: {
                type: IntLinearParameter,
                range: [0, 4],
                start: channel === 0 ? 0 : 4,
                monitorName: `Ch ${channel} complete`,
                listenToLaunchpadKnob: [1, channel],
            },
            periodTicks: {type: LogarithmicParameter,
                range: [2, 64],
                start: 16,
                listenToDecrementAndIncrementLaunchpadButtons: channel,
                listenToDecrementAndIncrementMixtrackButtons: [MixtrackButtons.L_LOOP_OUT, MixtrackButtons.L_LOOP_RELOOP],
                monitorName: `Ch ${channel} Period Ticks`,
            },
            rotation: {
                type: MovingAngleParameter,
                start: 60 * channel,
                max: 1,
                variance: 0.1,
                autoupdate: 500,
            },
            rippleRadius: {
                type: MovingLogarithmicParameter,
                range: [0.25, 16.0],
                start: 1 + channel / 2,
                monitorName: `Ch ${channel} Ripple Radius`,
                listenToLaunchpadFader: [channel, {addButtonStatusLight: true, useSnapButton: true}],
                variance: 0.2,
                autoupdateEveryNBeats: 8,
                autoupdateOnCue: true,
            },
            // ...P.CustomPercent({name: 'trailPercent', start: 0.5, inputPosition: [2, 2]}),
            // ...P.CustomPercent({name: 'revTrailPercent', start: 0, inputPosition: [1, 2]}),
        };
    }
    _incrementNumTicks() {
        this._riseNumTicks += 1;
    }
    _getRowIllumination(columnIndex, rowIndex) {
        const periodTicks = this.periodTicks.getValue();
        const rippleRadius = this.rippleRadius.getValue();
        return posMod(this._riseNumTicks - rowIndex / rippleRadius, periodTicks) / periodTicks;
    }
    getColorForColumnAndRow(column, row) {
        const [columnRot, rowRot] = xyRotatedAroundOriginWithAngle(
            column,
            row,
            this.rotation.getValue(),
        );

        const color = tinycolor(this.baseColor.getValue().toHexString()); // clone
        const baseRowIllumination = this._getRowIllumination(columnRot, rowRot);
        const revTrailPercent = 0.5; // 1 - this.revTrailPercent.getValue();
        let rowIllumination;
        if (baseRowIllumination > revTrailPercent || revTrailPercent === 0) {
            rowIllumination = arclerp(1, revTrailPercent, baseRowIllumination);
        } else {
            rowIllumination = arclerp(0, revTrailPercent, baseRowIllumination);
        }

        const volume = 2 - this.volume.getValue();
        if (volume < 1) {
            rowIllumination = lerp(0, rowIllumination, volume);
        } else if (volume > 1) {
            rowIllumination = lerp(rowIllumination, 1, volume - 1);
        }

        if (rowIllumination === 0) {
            return color;
        }
        const trailPercent = 1.0; // this.trailPercent.getValue();
        const defaultDarkenAmount = 50;
        const fullDarkenAmount = 65;
        let darkenAmount;
        if (trailPercent !== 0) {
            const trailedDarkenAmount = rowIllumination * fullDarkenAmount;
            darkenAmount = lerp(defaultDarkenAmount, trailedDarkenAmount, trailPercent);
        } else {
            darkenAmount = defaultDarkenAmount;
        }
        color.darken(darkenAmount);
        return color;
    }
}

module.exports = WallCircuitParameters;
