const _ = require('lodash');
const React = require('react');
const StopwatchParameters = require('js/stopwatch/parameters/StopwatchParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const StopwatchParticle = require('js/stopwatch/components/StopwatchParticle');

const Stopwatch = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        stopwatchParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render() {
        const tempo = this.context.beatmathParameters.tempo;
        const numTicks = tempo.getNumTicks();
        const numRings = this.context.stopwatchParameters.numRings.getValue();
        const numTrails = this.context.stopwatchParameters.numTrails.getValue();
        const trailLength = this.context.stopwatchParameters.trailLength.getValue();

        const startParticle = Math.max(numTicks - trailLength, 0);
        const endParticle = numTicks;

        return (
            <g>
                {_.times(numRings, ringIndex =>
                    <g key={ringIndex}>
                        {_.times(numTrails, trailIndex =>
                            <g key={trailIndex}>
                                {_.times(endParticle - startParticle, particleIndex =>
                                    <StopwatchParticle
                                        ringIndex={ringIndex}
                                        trailIndex={trailIndex}
                                        tick={startParticle + particleIndex}
                                        key={startParticle + particleIndex}
                                    />
                                )}
                            </g>
                        )}
                    </g>
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
