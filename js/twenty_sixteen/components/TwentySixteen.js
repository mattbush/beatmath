const _ = require('underscore');
const React = require('react');
const TwentySixteenParameters = require('js/twenty_sixteen/parameters/TwentySixteenParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const TwentySixteenPixel = require('js/twenty_sixteen/components/TwentySixteenPixel');

const NUM_GOLD = 20;
const NUM_BLUE = 16;

const TwentySixteen = React.createClass({
    childContextTypes: {
        twentySixteenParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            twentySixteenParameters: this.state.twentySixteenParameters,
        };
    },
    getInitialState: function() {
        return {
            twentySixteenParameters: new TwentySixteenParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        const golds = _.times(NUM_GOLD, index =>
            <TwentySixteenPixel
                color="gold"
                key={index}
                index={index}
            />
        );
        const blues = _.times(NUM_BLUE, index =>
            <TwentySixteenPixel
                color="blue"
                key={index}
                index={index}
            />
        );

        return (
            <BeatmathFrame>
                <g>
                    {golds}
                    {blues}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = TwentySixteen;
