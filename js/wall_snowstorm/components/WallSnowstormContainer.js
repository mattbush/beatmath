const React = require('react');
const WallSnowflakeParameters = require('js/wall_snowstorm/parameters/WallSnowflakeParameters');
const WallSnowstormParameters = require('js/wall_snowstorm/parameters/WallSnowstormParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallSnowstormGrid = require('js/wall_snowstorm/components/WallSnowstormGrid');
const WallSnowflakeContainer = require('js/wall_snowstorm/components/WallSnowflakeContainer');

const WallSnowstormContainer = React.createClass({
    childContextTypes: {
        wallSnowstormParameters: React.PropTypes.object,
        snowflakeParameters: React.PropTypes.array,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext() {
        return {
            wallSnowstormParameters: this.state.wallSnowstormParameters,
            snowflakeParameters: this.state.snowflakeParameters,
        };
    },
    getInitialState() {
        return {
            wallSnowstormParameters: new WallSnowstormParameters(this.context.mixboard, this.context.beatmathParameters),
            snowflakeParameters: [
                new WallSnowflakeParameters(this.context.mixboard, this.context.beatmathParameters, 0),
                new WallSnowflakeParameters(this.context.mixboard, this.context.beatmathParameters, 1),
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
