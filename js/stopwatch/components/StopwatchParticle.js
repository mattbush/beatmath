// const _ = require('lodash');
const React = require('react');
// const {lerp} = require('js/core/utils/math');

const StopwatchParticle = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        stopwatchParameters: React.PropTypes.object,
    },
    render() {
        if (this.props.visibleIndex === undefined) {
            return null;
        }

        const tempo = this.context.beatmathParameters.tempo;
        const currentTick = tempo.getNumTicks();

        const numVisibleTrails = this.context.stopwatchParameters.numVisibleTrails.getValue();

        const lastIndexRatio = (this.props.lastVisibleIndex + 0.5) / numVisibleTrails;
        const indexRatio = (this.props.visibleIndex + 0.5) / numVisibleTrails;

        const trailLength = this.context.stopwatchParameters.trailLength.getValue();
        const trailPosition = currentTick - this.props.tick;
        const trailRatio = (trailPosition + 0.5) / trailLength;

        const TOTAL_WIDTH = 1000;
        const HEIGHT = 50;
        const totalHeight = HEIGHT * trailLength;

        const lastX = -(TOTAL_WIDTH / 2) + lastIndexRatio * TOTAL_WIDTH;
        const x = -(TOTAL_WIDTH / 2) + indexRatio * TOTAL_WIDTH;
        const y = (totalHeight / 2) - trailRatio * totalHeight;
        const dx = x - lastX;

        const WIDTH_PERCENT = 0.5;
        const w = WIDTH_PERCENT * 800 / numVisibleTrails;
        const h = HEIGHT;

        // const distance = 100 * (1 + this.props.ringIndex);
        // const rotation = (360 * trailRatio) + (5 * this.props.tick);

        const fill = this.context.stopwatchParameters.getColorForTrailAndTick(this.props.visibleIndex, trailPosition);
        const delay = this.context.beatmathParameters.tempo.getPeriod();

        const style = {
            transform: `translate(${x}px,${y}px)`,
            transition: `transform ${delay}ms linear`,
        };

        const points = `${-dx - w / 2},${-h / 2} ${-dx + w / 2},${-h / 2} ${w / 2},${h / 2} ${-w / 2},${h / 2}`;

        return (
            <g style={style}>
                <polygon points={points} fill={fill.toHexString(true)} />
            </g>
        );
    },
});

module.exports = StopwatchParticle;
