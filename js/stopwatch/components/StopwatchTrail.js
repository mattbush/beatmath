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
            const attackPercent = this.context.stopwatchParameters.attackPercent.getValue();
            const numTicksToRetain = Math.max(trailLength, numTicksPerShuffle);

            const lastIndex = this._visibleIndicesByTick[currentTick - (currentTick % numTicksPerShuffle) - 1];
            let currentIndex = this.context.stopwatchParameters.getVisibleIndexForTrailId(this.props.trailId);
            // const finalIndex = currentIndex;

            const locationLerp = ((currentTick % numTicksPerShuffle + 1) / Math.ceil(numTicksPerShuffle * attackPercent));
            if (lastIndex !== undefined) {
                if (currentIndex !== undefined) {
                    currentIndex = lerp(lastIndex, currentIndex, Math.min(locationLerp, 1)); // TODO: lerp this faster, fewer ticks per shuffle
                }
            } else {
                if (locationLerp < 1) {
                    currentIndex = undefined;
                }
            }

            delete this._visibleIndicesByTick[currentTick - numTicksToRetain - 1];
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
                        lastVisibleIndex={this._visibleIndicesByTick[startTick + particleIndex - 1]}
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
