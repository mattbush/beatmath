const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const {lerp, clamp} = require('js/core/utils/math');
const mapColorString = require('js/core/utils/mapColorString');

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
        // const beatmathParameters = this.context.beatmathParameters;
        const treesParameters = this.context.treesParameters;
        const numRows = treesParameters.numRows.getValue();
        const rowSpacing = treesParameters.getRowSpacing();

        const polarGridAmount = clamp(treesParameters.polarGridAmount.getValue(), 0, 1);
        const baseColumnWidth = treesParameters.getColumnWidth();
        const rowHeight = treesParameters.getRowHeight();

        const borderRadius = treesParameters.getBorderRadius();

        return (
            <g>
                {_.times(numRows, rowIndex => {
                    const fill = mapColorString(treesParameters.getColorForIndexAndRow(this.props.index, rowIndex));
                    let xShift = 0;
                    let columnWidth = baseColumnWidth;
                    if (polarGridAmount > 0) {
                        columnWidth = lerp(baseColumnWidth, baseColumnWidth * (rowIndex + 1) / numRows, polarGridAmount);
                    }

                    return (
                        <rect
                            className="treeRect"
                            key={rowIndex}
                            fill={fill}
                            x={-(columnWidth / 2) + xShift}
                            y={rowIndex * rowSpacing + rowHeight / 2}
                            rx={borderRadius}
                            ry={borderRadius}
                            width={columnWidth}
                            height={rowHeight}
                        />
                    );
                })}
            </g>
        );
    },
});

module.exports = Tree;
