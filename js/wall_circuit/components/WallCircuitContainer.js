const _ = require('lodash');
const React = require('react');
const WallCircuitParameters = require('js/wall_circuit/parameters/WallCircuitParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallCircuitGrid = require('js/wall_circuit/components/WallCircuitGrid');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const WallCircuitContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        wallCircuitParametersByChannel: React.PropTypes.array,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallCircuitParametersByChannel: this.state.wallCircuitParametersByChannel,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const NUM_CHANNELS = 4;

        const wallCircuitParametersByChannel = _.range(NUM_CHANNELS).map(channel => {
            return new WallCircuitParameters(mixboard, this.context.beatmathParameters, channel);
        });
        return {wallCircuitParametersByChannel};
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <WallCircuitGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallCircuitContainer;
