var _ = require('underscore');
var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

var Tree = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        treesParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
//          foo: this.state.treesParameters.foo,
        };
    },
    render: function() {
        var treesParameters = this.context.treesParameters;
        var numLevels = treesParameters.numLevels.getValue();
        var levelSpacing = treesParameters.levelSpacing.getValue();
        var treeWidth = treesParameters.getTreeWidth();
        var levelHeight = treesParameters.getLevelHeight();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    return (
                        <rect
                            key={levelIndex}
                            fill="#0ff"
                            x={treeWidth / 2}
                            y={levelIndex * levelSpacing}
                            width={treeWidth}
                            height={levelHeight}
                        />
                    );
                })}
            </g>
        );
    },
});

module.exports = Tree;
