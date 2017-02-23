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

        const trailRatio = this.props.visibleIndex / this.context.stopwatchParameters.numVisibleTrails.getValue();

        const x = -400 + trailRatio * 800;
        const y = 200 - (10 * (currentTick - this.props.tick));

        // const distance = 100 * (1 + this.props.ringIndex);
        // const rotation = (360 * trailRatio) + (5 * this.props.tick);

        const fill = tinycolor('#f00').spin((5 * this.props.tick)).toHexString(true);

        const style = {
            transform: `translate(${x}px,${y}px)`,
        };

        return (
            <g style={style}>
                <circle cx="0" cy="0" r="10" fill={fill} />
            </g>
        );
    },
});

module.exports = StopwatchParticle;
