const _ = require('underscore');
const React = require('react');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const TreesParameters = require('js/trees/parameters/TreesParameters');
const Tree = require('js/trees/components/Tree');
const {clamp} = require('js/core/utils/math');

// const {manhattanDist, posMod} = require('js/core/utils/math');

const TreeFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        treesParameters: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        const treesParameters = this.context.treesParameters;
        const numTrees = treesParameters.numTrees.getValue();
        const treeSpacing = treesParameters.getTreeSpacing();
        const polarGridAmount = clamp(treesParameters.polarGridAmount.getValue(), 0, 1);

        const transformations = _.times(numTrees, index => {
            const totalTreeSpacing = treesParameters.getTotalTreeSpacing();
            const dx = ((index + 0.5) * treeSpacing - totalTreeSpacing / 2) * (1 - polarGridAmount);
            const dy = treesParameters.getTotalLevelSpacing() / 2 * (1 - polarGridAmount);
            const rotation = ((index + 0.5) - (numTrees / 2)) * (360 / numTrees) * polarGridAmount;
            return {
                transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scaleY(-1)`,
            };
        });

        return (
            <g>
                {_.times(numTrees, index =>
                    <g key={index} style={transformations[index]} className="tree">
                        <Tree index={index} />
                    </g>
                )}
            </g>
        );
    },
});

const TreeSet = React.createClass({
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
        const mixboard = this.context.mixboard;
        const treesParameters = new TreesParameters(mixboard, this.context.beatmathParameters);
        return {treesParameters};
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <TreeFrame />
            </BeatmathFrame>
        );
    },
});

module.exports = TreeSet;
