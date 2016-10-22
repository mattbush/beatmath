const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const BeatmathPixel = require('js/core/components/BeatmathPixel');
const tinycolor = require('tinycolor2');
const ARRANGEMENTS = require('js/twenty_sixteen/state/arrangements');

const PIXEL_SPACING = 40;
const PIXEL_SIZE = 25;

const TwentySixteenPixel = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        twentySixteenParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        const originalIndex = this.props.index;
        let indexMapping;
        if (this.props.color === 'gold') {
            indexMapping = this.context.twentySixteenParameters.goldIndexMappings[originalIndex];
        } else {
            indexMapping = this.context.twentySixteenParameters.blueIndexMappings[originalIndex];
        }

        return {
            arrangementIndex: this.context.twentySixteenParameters.arrangementIndex,
            indexMapping: indexMapping,
        };
    },
    render: function() {
        const arrangement = ARRANGEMENTS[this.getParameterValue('arrangementIndex')];
        const index = this.getParameterValue('indexMapping');

        let x, y;
        if (this.props.color === 'gold') {
            x = arrangement.goldX[index];
            y = arrangement.goldY[index];
        } else {
            x = arrangement.blueX[index];
            y = arrangement.blueY[index];
        }

        const xOffset = -arrangement.width / 2 * PIXEL_SPACING;
        const yOffset = -arrangement.height / 2 * PIXEL_SPACING;

        const translateX = (xOffset + x * PIXEL_SPACING) * arrangement.scale;
        const translateY = (yOffset + y * PIXEL_SPACING) * arrangement.scale;

        const transitionTime = this.context.beatmathParameters.tempo.getPeriod() / 2;

        let rotation = 0;
        if (this.context.twentySixteenParameters.reverseFrameRotationInPixels.getValue()) {
            rotation = -Math.round(this.context.beatmathParameters.frameRotation.getValue());
        }

        const style = {
            transform: `translate(${translateX}px, ${translateY}px) scale(${PIXEL_SIZE / 2}) rotate(${rotation}deg)`,
            transition: `transform ${transitionTime / 1000}s ease`,
        };

        let goldColor = this.context.twentySixteenParameters.goldColor.getValue();
        goldColor = tinycolor(goldColor.toHexString()); // clone

        const color = this.props.color === 'gold' ? goldColor : goldColor.spin(180);
        return (
            <g style={style}>
                <BeatmathPixel color={color} />
            </g>
        );
    },
});

module.exports = TwentySixteenPixel;
