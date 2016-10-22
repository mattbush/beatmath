const React = require('react');
const WallTreesParameters = require('js/wall_trees/parameters/WallTreesParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallTreesGrid = require('js/wall_trees/components/WallTreesGrid');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const WallTreesContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        wallTreesParameters: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallTreesParameters: this.state.wallTreesParameters,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const wallTreesParameters = new WallTreesParameters(mixboard, this.context.beatmathParameters);
        return {wallTreesParameters};
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <WallTreesGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallTreesContainer;
