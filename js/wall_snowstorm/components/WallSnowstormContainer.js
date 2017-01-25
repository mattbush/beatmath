const React = require('react');
const WallowParameters = require('js/wallow/parameters/WallowParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallSnowstormGrid = require('js/wallow/components/WallSnowstormGrid');

const WallSnowstormContainer = React.createClass({
    childContextTypes: {
        wallowParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallowParameters: this.state.wallowParameters,
        };
    },
    getInitialState: function() {
        return {
            wallowParameters: new WallowParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <WallSnowstormGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallSnowstormContainer;
