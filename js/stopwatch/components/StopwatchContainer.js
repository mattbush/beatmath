const _ = require('lodash');
const React = require('react');
const StopwatchParameters = require('js/stopwatch/parameters/StopwatchParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const StopwatchTrail = require('js/stopwatch/components/StopwatchTrail');

const Stopwatch = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        stopwatchParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            numTrailsChanged: this.context.stopwatchParameters.numTrailsChanged,
        };
    },
    render() {
        const numTrails = this.context.stopwatchParameters.getTrailCount();

        return (
            <g>
                {_.times(numTrails, trailId =>
                    <StopwatchTrail trailId={trailId} key={trailId} />
                )}
            </g>
        );
    },
});

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
                <Stopwatch />
            </BeatmathFrame>
        );
    },
});

module.exports = StopwatchContainer;
