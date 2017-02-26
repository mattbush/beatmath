const _ = require('lodash');
const React = require('react');
const {clamp, modAndShiftToHalf, lerp, logerp} = require('js/core/utils/math');

const TWOPI = 2 * Math.PI;

const StopwatchParticle = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        stopwatchParameters: React.PropTypes.object,
    },
    render() {
        if (this.props.visibleIndex === undefined) {
            return null;
        }

        const {stopwatchParameters, beatmathParameters} = this.context;

        const tempo = beatmathParameters.tempo;
        const currentTick = tempo.getNumTicks();

        const numVisibleTrails = stopwatchParameters.numVisibleTrails.getValue();

        const lastIndexRatio = (this.props.lastVisibleIndex + 0.5) / numVisibleTrails;
        const indexRatio = (this.props.visibleIndex + 0.5) / numVisibleTrails;

        const trailLength = stopwatchParameters.trailLength.getValue();
        const trailPosition = currentTick - this.props.tick;
        const trailRatio = (trailPosition + 0.5) / trailLength;

        const GROWTH_RATIO = 1.2;
        const WIDTH_PERCENT = 0.4; // TODO make this a param

        const polarGridAmount = clamp(stopwatchParameters.polarGridAmount.getValue(), 0, 1);
        let polarO;
        let cartesianO;

        if (polarGridAmount > 0) {
            const scale = 32 * GROWTH_RATIO ** trailPosition; // TODO cache this
            const lastRotationRad = lastIndexRatio * TWOPI;
            const rotationRad = indexRatio * TWOPI;
            const widthRad = WIDTH_PERCENT * TWOPI / numVisibleTrails;

            const dTheta = modAndShiftToHalf(rotationRad - lastRotationRad, TWOPI);

            polarO = {
                x: 0,
                y: 0,
                scale: scale,
                rotation: TWOPI / 4 + rotationRad,

                px1: GROWTH_RATIO * Math.cos(-dTheta - widthRad / 2), py1: GROWTH_RATIO * Math.sin(-dTheta - widthRad / 2),
                px2: GROWTH_RATIO * Math.cos(-dTheta + widthRad / 2), py2: GROWTH_RATIO * Math.sin(-dTheta + widthRad / 2),
                px3: Math.cos(widthRad / 2), py3: Math.sin(widthRad / 2),
                px4: Math.cos(-widthRad / 2), py4: Math.sin(-widthRad / 2),
            };

        }

        if (polarGridAmount < 1) {
            const TOTAL_WIDTH = 1000;
            const HEIGHT = 50;
            const totalHeight = HEIGHT * trailLength;

            const lastX = -(TOTAL_WIDTH / 2) + lastIndexRatio * TOTAL_WIDTH;
            const x = -(TOTAL_WIDTH / 2) + indexRatio * TOTAL_WIDTH;
            const y = (totalHeight / 2) - trailRatio * totalHeight;
            const dx = x - lastX;

            const w = WIDTH_PERCENT * 800 / numVisibleTrails;
            const h = HEIGHT;

            cartesianO = {
                x: x,
                y: y,
                scale: 1,
                rotation: 0,

                px1: -dx - w / 2, py1: -h / 2,
                px2: -dx + w / 2, py2: -h / 2,
                px3: w / 2, py3: h / 2,
                px4: -w / 2, py4: h / 2,
            };
        }

        const o =
            polarGridAmount === 1 ? polarO :
            polarGridAmount === 0 ? cartesianO :
            // meh
            _.mapValues(cartesianO, (val, key) => (key === 'scale' ? logerp : lerp)(val, polarO[key], polarGridAmount));

        // TODO: instead of passing trailPosition could pass this.props.tick or something else
        const fill = stopwatchParameters.getColorForTrailAndTick(this.props.visibleIndex, trailPosition);
        const delay = beatmathParameters.tempo.getPeriod() * stopwatchParameters.delayCoefficient.getValue();

        const style = {
            transform: `scale(${o.scale}) rotate(${o.rotation}rad) translate(${o.x}px,${o.y}px)`,
            transition: `transform ${delay}ms linear`,
        };

        // stop logspew, TODO look into
        if ([o.px1, o.py1, o.px2, o.py2, o.px3, o.py3, o.px4, o.py4].some(isNaN)) {
            return null;
        }

        const points = [
            [o.px1, o.py1],
            [o.px2, o.py2],
            [o.px3, o.py3],
            [o.px4, o.py4],
        ].map(p => p.join(',')).join(' ');

        return (
            <g style={style}>
                <polygon points={points} fill={fill.toHexString(true)} />
            </g>
        );
    },
});

module.exports = StopwatchParticle;
