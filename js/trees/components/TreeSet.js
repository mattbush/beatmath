var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/core/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var TreesParameters = require('js/trees/parameters/TreesParameters');
var Tree = require('js/trees/components/Tree');

// const {manhattanDist, posMod} = require('js/core/utils/math');

var TreeSet = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        treesParameters: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            treesParameters: this.state.treesParameters,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var treesParameters = new TreesParameters(mixboard, this.context.beatmathParameters);
        return {treesParameters};
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        var treesParameters = this.state.treesParameters;
        var numTrees = treesParameters.numTrees.getValue();
        var treeSpacing = treesParameters.treeSpacing.getValue();
        var polarGridAmount = treesParameters.polarGridAmount.getValue();

        var transformations = _.times(numTrees, index => {
            var totalTreeSpacing = treesParameters.getTotalTreeSpacing();
            var dx = ((index + 0.5) * treeSpacing - totalTreeSpacing / 2) * (1 - polarGridAmount);
            var dy = treesParameters.getTotalLevelSpacing() / 2 * (1 - polarGridAmount);
            var rotation = ((index + 0.5) - (numTrees / 2)) * (360 / numTrees) * polarGridAmount;
            return {
                transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scaleY(-1)`,
            };
        });

        return (
            <BeatmathFrame>
                {_.times(numTrees, index =>
                    <g key={index} style={transformations[index]} className="tree">
                        <Tree index={index} />
                    </g>
                )}
            </BeatmathFrame>
        );
    },
});

module.exports = TreeSet;
