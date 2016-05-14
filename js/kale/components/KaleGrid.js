const React = require('react');
const KaleCell = require('js/kale/components/KaleCell');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

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
        if (this.getParameterValue('isInfinite')) {
            kaleCells = <KaleCell logicalX={0} logicalY={0} />;
        } else {
            kaleCells = [];
            const numRows = this.getParameterValue('numRows');
            const numCols = this.getParameterValue('numCols');
            for (let y = -numRows; y <= numRows; y++) {
                for (let x = -numCols; x <= numCols; x++) {
                    if ((x + y) % 2 !== 0) {
                        continue;
                    }
                    kaleCells.push(
                        <KaleCell key={`${x}~${y}`} logicalX={x} logicalY={y} />
                    );
                }
            }
        }

        return (
            <g transform="scale(64)">
                {kaleCells}
            </g>
        );
    },
});

module.exports = KaleGrid;
