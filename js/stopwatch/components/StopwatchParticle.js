// const _ = require('lodash');
const React = require('react');
// const {lerp} = require('js/core/utils/math');
const tinycolor = require('tinycolor2');
// const mapColorString = require('js/core/utils/mapColorString');

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

        const lastTrailRatio = this.props.lastVisibleIndex / numVisibleTrails;
        const trailRatio = this.props.visibleIndex / numVisibleTrails;

        const HEIGHT = 50;

        const lastX = -400 + lastTrailRatio * 800;
        const x = -400 + trailRatio * 800;
        const y = 200 - (HEIGHT * (currentTick - this.props.tick));
        const dx = x - lastX;

        const WIDTH_PERCENT = 0.5;
        const w = WIDTH_PERCENT * 800 / numVisibleTrails;
        const h = HEIGHT;

        // const distance = 100 * (1 + this.props.ringIndex);
        // const rotation = (360 * trailRatio) + (5 * this.props.tick);

        const fill = tinycolor('#f00').spin((5 * this.props.tick)).toHexString(true);
        const delay = this.context.beatmathParameters.tempo.getPeriod();

        const style = {
            transform: `translate(${x}px,${y}px)`,
            transition: `transform ${delay}ms linear`,
        };

        const points = `${-dx - w / 2},${-h / 2} ${-dx + w / 2},${-h / 2} ${w / 2},${h / 2} ${-w / 2},${h / 2}`;

        return (
            <g style={style}>
                <polygon points={points} fill={fill} />
            </g>
        );
    },
});

module.exports = StopwatchParticle;
