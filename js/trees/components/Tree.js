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

        var borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    var fill = treesParameters.getColorForIndexAndLevel(this.props.index, levelIndex);

                    return (
                        <rect
                            className="treeRect"
                            key={levelIndex}
                            fill={fill}
                            x={-(treeWidth / 2)}
                            y={levelIndex * levelSpacing}
                            rx={borderRadius}
                            ry={borderRadius}
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
