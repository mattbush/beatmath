var React = require('react');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
const ARRANGEMENTS = require('js/state/twenty_sixteen/arrangements');

const PIXEL_SPACING = 40;
const PIXEL_SIZE = 20;
const OFFSET_TRANSITION_TIME = 500;

const TwentySixteenPixel = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        twentySixteenParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            arrangementIndex: this.context.twentySixteenParameters.arrangementIndex,
        };
    },
    render: function() {
        var arrangement = ARRANGEMENTS[this.getParameterValue('arrangementIndex')];
        var index = this.props.index;

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

        var style = {
            transform: `translate(${xOffset + x * PIXEL_SPACING}px, ${yOffset + y * PIXEL_SPACING}px)`,
            transition: `transform ${OFFSET_TRANSITION_TIME / 1000}s ease`,
        };

        var fill = this.props.color === 'gold' ? '#e90' : '#39f';
        return (
            <g style={style}>
                <circle cx="0" cy="0" fill={fill} r={PIXEL_SIZE / 2} />
            </g>
        );
    },
});

module.exports = TwentySixteenPixel;
