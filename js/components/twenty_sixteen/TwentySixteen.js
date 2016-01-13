var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/components/BeatmathFrame');

const ARRANGEMENTS = require('js/state/twenty_sixteen/arrangements');
const NUM_GOLD = 20;
const NUM_BLUE = 16;

const PIXEL_SPACING = 40;
const PIXEL_SIZE = 20;
const OFFSET_TRANSITION_TIME = 1000;

const TwentySixteenPixel = React.createClass({
    render: function() {
        var fill = this.props.color === 'gold' ? '#e90' : '#39f';
        return (
            <circle cx={this.props.x * PIXEL_SPACING} cy={this.props.y * PIXEL_SPACING} fill={fill} r={PIXEL_SIZE / 2} />
        );
    },
});

const TwentySixteen = React.createClass({
    getInitialState: function() {
        return {
            arrangementIndex: 1,
        };
    },
    render: function() {
        var arrangement = ARRANGEMENTS[this.state.arrangementIndex];
        var golds = _.times(NUM_GOLD, index =>
            <TwentySixteenPixel
                color="gold"
                key={index}
                x={arrangement.goldX[index]}
                y={arrangement.goldY[index]}
            />
        );
        var blues = _.times(NUM_BLUE, index =>
            <TwentySixteenPixel
                color="blue"
                key={index}
                x={arrangement.blueX[index]}
                y={arrangement.blueY[index]}
            />
        );

        var xOffset = -arrangement.width / 2 * PIXEL_SPACING;
        var yOffset = -arrangement.height / 2 * PIXEL_SPACING;

        var style = {
            transform: `translate(${xOffset}px, ${yOffset}px)`,
            transition: `transform ${OFFSET_TRANSITION_TIME / 2000}s ease`,
        };

        return (
            <BeatmathFrame>
                <g style={style}>
                    {golds}
                    {blues}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = TwentySixteen;
