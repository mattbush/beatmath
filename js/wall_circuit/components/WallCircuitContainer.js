const React = require('react');
const WallCircuitParameters = require('js/wall_circuit/parameters/WallCircuitParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallCircuitGrid = require('js/wall_circuit/components/WallCircuitGrid');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const WallCircuitContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        wallCircuitParameters: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallCircuitParameters: this.state.wallCircuitParameters,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const wallCircuitParameters = new WallCircuitParameters(mixboard, this.context.beatmathParameters);
        return {wallCircuitParameters};
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
