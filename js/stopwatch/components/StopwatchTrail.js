const _ = require('lodash');
const React = require('react');
const {lerp} = require('js/core/utils/math');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const StopwatchParticle = require('js/stopwatch/components/StopwatchParticle');

const StopwatchTrail = React.createClass({
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
    componentWillMount() {
        this._visibleIndicesByTick = {};
    },
    componentWillUpdate() {
        const tempo = this.context.beatmathParameters.tempo;
        const currentTick = tempo.getNumTicks();

        if (currentTick !== this._lastTick) {
            const trailLength = this.context.stopwatchParameters.trailLength.getValue();
            const numTicksPerShuffle = this.context.stopwatchParameters.numTicksPerShuffle.getValue();
            const numTicksToRetain = Math.max(trailLength, numTicksPerShuffle);

            const lastIndex = this._visibleIndicesByTick[currentTick - numTicksPerShuffle];
            let currentIndex = this.context.stopwatchParameters.getVisibleIndexForTrailId(this.props.trailId);
            if (lastIndex !== undefined && currentIndex !== undefined) {
                const locationLerp = ((currentTick % numTicksPerShuffle) + 0.5) / numTicksPerShuffle;
                currentIndex = lerp(lastIndex, currentIndex, locationLerp); // TODO: lerp this faster, fewer ticks per shuffle
            }

            delete this._visibleIndicesByTick[currentTick - numTicksToRetain];
            this._visibleIndicesByTick[currentTick] = currentIndex;

            this._lastTick = tempo.getNumTicks();
        }
    },
    render() {
        const tempo = this.context.beatmathParameters.tempo;
        const numTicks = tempo.getNumTicks();

        const trailLength = this.context.stopwatchParameters.trailLength.getValue();

        const startTick = Math.max(numTicks - trailLength, 0);
        const endTick = numTicks;

        return (
            <g>
                {_.times(endTick - startTick, particleIndex =>
                    <StopwatchParticle
                        visibleIndex={this._visibleIndicesByTick[startTick + particleIndex]}
                        tick={startTick + particleIndex}
                        key={startTick + particleIndex}
                    />
                )}
            </g>
        );
    },
});

module.exports = StopwatchTrail;
