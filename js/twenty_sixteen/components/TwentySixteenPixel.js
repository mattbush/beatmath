var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var BeatmathPixel = require('js/core/components/BeatmathPixel');
var tinycolor = require('tinycolor2');
const ARRANGEMENTS = require('js/twenty_sixteen/state/arrangements');

const PIXEL_SPACING = 40;
const PIXEL_SIZE = 20;
const OFFSET_TRANSITION_TIME = 500;

const TwentySixteenPixel = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        twentySixteenParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        var originalIndex = this.props.index;
        var indexMapping;
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
        var arrangement = ARRANGEMENTS[this.getParameterValue('arrangementIndex')];
        var index = this.getParameterValue('indexMapping');

        var x, y;
        if (this.props.color === 'gold') {
            x = arrangement.goldX[index];
            y = arrangement.goldY[index];
        } else {
            x = arrangement.blueX[index];
            y = arrangement.blueY[index];
        }

        var xOffset = -arrangement.width / 2 * PIXEL_SPACING;
        var yOffset = -arrangement.height / 2 * PIXEL_SPACING;

        var translateX = (xOffset + x * PIXEL_SPACING) * arrangement.scale;
        var translateY = (yOffset + y * PIXEL_SPACING) * arrangement.scale;

        var style = {
            transform: `translate(${translateX}px, ${translateY}px) scale(${PIXEL_SIZE / 2})`,
            transition: `transform ${OFFSET_TRANSITION_TIME / 1000}s ease`,
        };

        var goldColor = this.context.twentySixteenParameters.goldColor.getValue();
        goldColor = tinycolor(goldColor.toHexString()); // clone

        var color = this.props.color === 'gold' ? goldColor : goldColor.spin(180);
        return (
            <g style={style}>
                <BeatmathPixel color={color} />
            </g>
        );
    },
});

module.exports = TwentySixteenPixel;
