var _ = require('underscore');
var React = require('react');
var TwentySixteenParameters = require('js/twenty_sixteen/parameters/TwentySixteenParameters');
var BeatmathFrame = require('js/core/components/BeatmathFrame');

var TwentySixteenPixel = require('js/twenty_sixteen/components/TwentySixteenPixel');

const NUM_GOLD = 20;
const NUM_BLUE = 16;

const TwentySixteen = React.createClass({
    childContextTypes: {
        twentySixteenParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            twentySixteenParameters: this.state.twentySixteenParameters,
        };
    },
    getInitialState: function() {
        return {
            twentySixteenParameters: new TwentySixteenParameters(this.context.mixboard),
        };
    },
    render: function() {
        var golds = _.times(NUM_GOLD, index =>
            <TwentySixteenPixel
                color="gold"
                key={index}
                index={index}
            />
        );
        var blues = _.times(NUM_BLUE, index =>
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
