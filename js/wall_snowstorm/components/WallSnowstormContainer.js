const React = require('react');
const WallSnowstormParameters = require('js/wall_snowstorm/parameters/WallSnowstormParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallSnowstormGrid = require('js/wall_snowstorm/components/WallSnowstormGrid');
const WallSnowflakeContainer = require('js/wall_snowstorm/components/WallSnowflakeContainer');

const WallSnowstormContainer = React.createClass({
    childContextTypes: {
        snowstormParameters: React.PropTypes.array,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext() {
        return {
            snowstormParameters: this.state.snowstormParameters,
        };
    },
    getInitialState() {
        return {
            snowstormParameters: [
                new WallSnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 0),
                new WallSnowstormParameters(this.context.mixboard, this.context.beatmathParameters, 1),
            ],
        };
    },
    render() {
        return (
            <BeatmathFrame>
                <WallSnowflakeContainer />
                <WallSnowstormGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallSnowstormContainer;
