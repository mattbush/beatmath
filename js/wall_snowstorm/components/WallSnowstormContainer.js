const React = require('react');
const WallowParameters = require('js/wallow/parameters/WallowParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallSnowstormGrid = require('js/wall_snowstorm/components/WallSnowstormGrid');

const WallSnowstormContainer = React.createClass({
    childContextTypes: {
        wallowParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext() {
        return {
            wallowParameters: this.state.wallowParameters,
        };
    },
    getInitialState() {
        return {
            wallowParameters: new WallowParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render() {
        return (
            <BeatmathFrame>
                <WallSnowstormGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallSnowstormContainer;
