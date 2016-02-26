var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
var TreesParameters = require('js/parameters/trees/TreesParameters');

// const {manhattanDist, posMod} = require('js/utils/math');

const NUM_TREES = 3;
const TREE_SPACING = 100;
const LEVEL_SPACING = 20;
const NUM_LEVELS = 4;
const TREE_HEIGHT = LEVEL_SPACING * NUM_LEVELS;

var Tree = React.createClass({
    render: function() {
        return (
            <g>
                {_.times(NUM_LEVELS, levelIndex => {
                    return (
                        <rect fill="#0ff" x={-30} y={levelIndex * LEVEL_SPACING} width={60} height={10} />
                    );
                })}
            </g>
        );
    },
});

var TreeSet = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        treesParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            treesParameters: this.state.treesParameters,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var treesParameters = new TreesParameters(mixboard);
        return {treesParameters};
    },
    getParameterBindings: function() {
        return {
//          foo: this.state.treesParameters.foo,
        };
    },
    render: function() {
        var transformations = _.times(NUM_TREES, index => {
            var totalTreeSpacing = (NUM_TREES - 1) * TREE_SPACING;
            var dx = index * TREE_SPACING - totalTreeSpacing / 2;
            var dy = -TREE_HEIGHT / 2;
            return {
                transform: `translate(${dx}px, ${dy}px) scaleY(-1)`,
            };
        });

        return (
            <BeatmathFrame>
                {_.times(NUM_TREES, index =>
                    <g key={index} style={transformations[index]}>
                        <Tree />
                    </g>
                )}
            </BeatmathFrame>
        );
    },
});

module.exports = TreeSet;
