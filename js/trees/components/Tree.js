const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const {lerp, clamp} = require('js/core/utils/math');

const Tree = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        treesParameters: React.PropTypes.object,
        groupType: React.PropTypes.string,
    },
    getParameterBindings: function() {
        return {
//          foo: this.state.treesParameters.foo,
        };
    },
    render: function() {
        const beatmathParameters = this.context.beatmathParameters;
        const treesParameters = this.context.treesParameters;
        const numLevels = treesParameters.numLevels.getValue();
        const levelSpacing = treesParameters.getLevelSpacing();

        const polarGridAmount = clamp(treesParameters.polarGridAmount.getValue(), 0, 1);
        const baseTreeWidth = treesParameters.getTreeWidth();

        const triangleCompressionPercent = beatmathParameters.triangleCompressionPercent.getValue();

        const levelHeight = treesParameters.getLevelHeight();

        const borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numLevels, levelIndex => {
                    const fill = treesParameters.getColorForIndexAndLevel(this.props.index, levelIndex);
                    let xShift = 0;
                    let treeWidth = baseTreeWidth;
                    if (polarGridAmount > 0) {
                        treeWidth = lerp(baseTreeWidth, baseTreeWidth * (levelIndex + 1) / numLevels, polarGridAmount);
                    }

                    if (this.context.groupType !== 'tower' && triangleCompressionPercent > 0) {
                        const triangleCompressionPercentPerLevel = triangleCompressionPercent * (levelIndex + 1) / numLevels;
                        const compressionCoeff = (1 - triangleCompressionPercentPerLevel);
                        treeWidth *= compressionCoeff;

                        const treeSpacing = treesParameters.getTreeSpacing();

                        const totalTreeSpacing = treesParameters.getTotalTreeSpacing();
                        const parentDx = ((this.props.index + 0.5) * treeSpacing - totalTreeSpacing / 2) * (1 - polarGridAmount);

                        xShift = -parentDx * triangleCompressionPercentPerLevel;
                    }

                    return (
                        <rect
                            className="treeRect"
                            key={levelIndex}
                            fill={fill}
                            x={-(treeWidth / 2) + xShift}
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
