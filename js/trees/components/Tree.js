var _ = require('underscore');
var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var {lerp} = require('js/core/utils/math');

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

        var polarGridAmount = treesParameters.polarGridAmount.getValue();
        var baseTreeWidth = treesParameters.getTreeWidth();

        var levelHeight = treesParameters.getLevelHeight();

        var borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    var fill = treesParameters.getColorForIndexAndLevel(this.props.index, levelIndex);
                    var treeWidth = baseTreeWidth;
                    if (polarGridAmount > 0) {
                        treeWidth = lerp(baseTreeWidth, baseTreeWidth * (levelIndex + 1) / numLevels, polarGridAmount);
                    }

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
