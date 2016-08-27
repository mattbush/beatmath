const React = require('react');
const KaleCell = require('js/kale/components/KaleCell');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const SCALE = 64;

const KaleGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        kaleParameters: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            numRows: this.context.kaleParameters.numRows,
            numCols: this.context.kaleParameters.numCols,
            isInfinite: this.context.kaleParameters.isInfinite,
        };
    },
    render: function() {
        let kaleCells;
        const mapperShape = this.props.mapperShape;
        let mapperShapeXOffset = mapperShape ? mapperShape.getCenterX() / SCALE : 0;
        const mapperShapeYOffset = mapperShape ? mapperShape.getCenterY() / SCALE : 0;

        if (this.getParameterValue('isInfinite')) {
            kaleCells = (
                <KaleCell
                    logicalX={0}
                    logicalY={0}
                    mapperShapeXOffset={mapperShapeXOffset}
                    mapperShapeYOffset={mapperShapeYOffset}
                />
            );
        } else {

            kaleCells = [];
            const numRows = this.getParameterValue('numRows');
            const numCols = this.getParameterValue('numCols');

            if (this.context.beatmathParameters.mappingMode.getValue() === 'acrossGroups') {
                mapperShapeXOffset = this.props.mapperShapeIndex ? (numCols + 0.5) : -(numCols + 0.5);
            }

            for (let y = -numRows; y <= numRows; y++) {
                for (let x = -numCols; x <= numCols; x++) {
                    if ((x + y) % 2 !== 0) {
                        continue;
                    }
                    kaleCells.push(
                        <KaleCell
                            key={`${x}~${y}`}
                            logicalX={x}
                            logicalY={y}
                            mapperShapeXOffset={mapperShapeXOffset}
                            mapperShapeYOffset={mapperShapeYOffset}
                        />
                    );
                }
            }
        }

        return (
            <g transform={`scale(${SCALE})`}>
                {kaleCells}
            </g>
        );
    },
});

module.exports = KaleGrid;
