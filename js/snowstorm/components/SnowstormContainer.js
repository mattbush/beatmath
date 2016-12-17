const React = require('react');
const SnowstormParameters = require('js/snowstorm/parameters/SnowstormParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const Snowflake = require('js/snowstorm/components/Snowflake');

const SnowstormContainer = React.createClass({
    childContextTypes: {
        snowstormParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            snowstormParameters: this.state.snowstormParameters,
        };
    },
    getInitialState: function() {
        return {
            snowstormParameters: new SnowstormParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <Snowflake />
            </BeatmathFrame>
        );
    },
});

module.exports = SnowstormContainer;
