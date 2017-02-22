const React = require('react');
const StopwatchParameters = require('js/stopwatch/parameters/StopwatchParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const StopwatchContainer = React.createClass({
    childContextTypes: {
        stopwatchParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext() {
        return {
            stopwatchParameters: this.state.stopwatchParameters,
        };
    },
    getInitialState() {
        return {
            stopwatchParameters: new StopwatchParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render() {
        return (
            <BeatmathFrame>
                Hello world!
            </BeatmathFrame>
        );
    },
});

module.exports = StopwatchContainer;
