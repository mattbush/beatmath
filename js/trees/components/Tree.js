var _ = require('underscore');
var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
var tinycolor = require('tinycolor2');

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

        var brightColor = treesParameters.levelColor.getValue().toHexString(true);
        var darkColor = tinycolor(brightColor).darken(60).toHexString(true);

        var borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    var isLevelIlluminated = treesParameters.isLevelIlluminated(levelIndex);
                    var fill = isLevelIlluminated ? brightColor : darkColor;

                    return (
                        <rect
                            key={levelIndex}
                            fill={fill}
                            x={treeWidth / 2}
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
