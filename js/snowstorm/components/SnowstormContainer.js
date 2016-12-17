const _ = require('lodash');
const React = require('react');
const SnowstormParameters = require('js/snowstorm/parameters/SnowstormParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const Snowflake = require('js/snowstorm/components/Snowflake');

const SnowstormContainer = React.createClass({
    childContextTypes: {
        snowstormParameters: React.PropTypes.array,
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
            snowstormParameters: [
                new SnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 0),
                new SnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 1),
            ],
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                {_.times(11, i => <Snowflake index={i} blend={i / 10} />)}
            </BeatmathFrame>
        );
    },
});

module.exports = SnowstormContainer;
