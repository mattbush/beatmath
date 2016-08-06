const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const {lerp, clamp} = require('js/core/utils/math');

const Tree = React.createClass({
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
        const treesParameters = this.context.treesParameters;
        const numLevels = treesParameters.numLevels.getValue();
        const levelSpacing = treesParameters.getLevelSpacing();

        const polarGridAmount = clamp(treesParameters.polarGridAmount.getValue(), 0, 1);
        const baseTreeWidth = treesParameters.getTreeWidth();

        const levelHeight = treesParameters.getLevelHeight();

        const borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    const fill = treesParameters.getColorForIndexAndLevel(this.props.index, levelIndex);
                    let treeWidth = baseTreeWidth;
                    if (polarGridAmount > 0) {
                        treeWidth = lerp(baseTreeWidth, baseTreeWidth * (levelIndex + 1) / numLevels, polarGridAmount);
                    }

                    return (
                        <rect
                            className="treeRect"
                            key={levelIndex}
                            fill={fill}
                            x={-(treeWidth / 2)}
                            y={levelIndex * levelSpacing + levelHeight / 2}
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
