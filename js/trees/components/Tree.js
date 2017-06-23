const _ = require('lodash');
const React = require('react');
// const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const mapColorString = require('js/core/utils/mapColorString');
const {xyStringFromAngleRadAndRadius} = require('js/core/utils/math');

const TWOPI = 2 * Math.PI;

const Tree = React.createClass({
    // mixins: [ParameterBindingsMixin],
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
        const numRows = this.props.numRows;
        const treesParameters = this.context.treesParameters;

        if (this.props.polarGridAmount) {
            const widthRad = TWOPI / this.props.numColumns;
            const halfWidthRad = (-Math.PI + widthRad) / 2;
            const negHalfWidthRad = (-Math.PI - widthRad) / 2;

            const rowSpacing = treesParameters.getRowSpacing();
            const rowHeight = treesParameters.getRowHeight();

            return (
                <g>
                    {_.times(numRows, rowIndex => {
                        const fill = mapColorString(treesParameters.getColorForIndexAndRow(this.props.index, rowIndex, this.props.numColumns));

                        const innerRadius = rowIndex * rowSpacing;
                        const outerRadius = innerRadius + rowHeight;

                        const points = [
                            xyStringFromAngleRadAndRadius(negHalfWidthRad, innerRadius),
                            xyStringFromAngleRadAndRadius(halfWidthRad, innerRadius),
                            xyStringFromAngleRadAndRadius(halfWidthRad, outerRadius),
                            xyStringFromAngleRadAndRadius(negHalfWidthRad, outerRadius),
                        ];

                        return (
                            <polygon
                                points={points.join(' ')}
                                key={rowIndex}
                                fill={fill}
                            />
                        );
                    })}
                </g>
            );

        } else {
            const rowSpacing = treesParameters.getRowSpacing();
            const baseColumnWidth = treesParameters.getColumnWidth();
            const rowHeight = treesParameters.getRowHeight();
            const borderRadius = treesParameters.getBorderRadius();

            return (
                <g>
                    {_.times(numRows, rowIndex => {
                        const fill = mapColorString(treesParameters.getColorForIndexAndRow(this.props.index, rowIndex, this.props.numColumns));
                        const columnWidth = baseColumnWidth;

                        return (
                            <rect
                                className="treeRect"
                                key={rowIndex}
                                fill={fill}
                                x={-(columnWidth / 2)}
                                y={rowIndex * rowSpacing}
                                rx={borderRadius}
                                ry={borderRadius}
                                width={columnWidth}
                                height={rowHeight}
                            />
                        );
                    })}
                </g>
            );
        }
    },
});

module.exports = Tree;
