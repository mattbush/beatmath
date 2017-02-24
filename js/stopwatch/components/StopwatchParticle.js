// const _ = require('lodash');
const React = require('react');
const {clamp, modAndShiftToHalf} = require('js/core/utils/math');

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

        // TODO: instead of passing trailPosition could pass this.props.tick or something else
        const fill = stopwatchParameters.getColorForTrailAndTick(this.props.visibleIndex, trailPosition);
        const delay = beatmathParameters.tempo.getPeriod();

        const polarGridAmount = clamp(stopwatchParameters.polarGridAmount.getValue(), 0, 1);

        if (polarGridAmount >= 0.5) {
            const scale = 32 * GROWTH_RATIO ** trailPosition; // TODO cache this
            const lastRotationRad = lastIndexRatio * TWOPI;
            const rotationRad = indexRatio * TWOPI;
            const widthRad = WIDTH_PERCENT * TWOPI / numVisibleTrails;

            const dTheta = modAndShiftToHalf(rotationRad - lastRotationRad, TWOPI);

            const style = {
                transform: `scale(${scale}) rotate(${TWOPI / 4 + rotationRad}rad)`,
                transition: `transform ${delay}ms linear`,
            };

            // TODO: it looks cool when the structure is jagged and the ends are reversed
            const points = [
                [GROWTH_RATIO * Math.cos(-dTheta - widthRad / 2), GROWTH_RATIO * Math.sin(-dTheta - widthRad / 2)],
                [GROWTH_RATIO * Math.cos(-dTheta + widthRad / 2), GROWTH_RATIO * Math.sin(-dTheta + widthRad / 2)],
                [Math.cos(widthRad / 2), Math.sin(widthRad / 2)],
                [Math.cos(-widthRad / 2), Math.sin(-widthRad / 2)],
            ].map(p => p.join(',')).join(' ');

            return (
                <g style={style}>
                    <polygon points={points} fill={fill.toHexString(true)} />
                </g>
            );
        } else {
            const TOTAL_WIDTH = 1000;
            const HEIGHT = 50;
            const totalHeight = HEIGHT * trailLength;

            const lastX = -(TOTAL_WIDTH / 2) + lastIndexRatio * TOTAL_WIDTH;
            const x = -(TOTAL_WIDTH / 2) + indexRatio * TOTAL_WIDTH;
            const y = (totalHeight / 2) - trailRatio * totalHeight;
            const dx = x - lastX;

            const w = WIDTH_PERCENT * 800 / numVisibleTrails;
            const h = HEIGHT;

            // const distance = 100 * (1 + this.props.ringIndex);
            // const rotation = (360 * trailRatio) + (5 * this.props.tick);

            const style = {
                transform: `translate(${x}px,${y}px)`,
                transition: `transform ${delay}ms linear`,
            };

            const points = [
                [-dx - w / 2, -h / 2],
                [-dx + w / 2, -h / 2],
                [w / 2, h / 2],
                [-w / 2, h / 2],
            ].map(p => p.join(',')).join(' ');

            return (
                <g style={style}>
                    <polygon points={points} fill={fill.toHexString(true)} />
                </g>
            );
        }
    },
});

module.exports = StopwatchParticle;
