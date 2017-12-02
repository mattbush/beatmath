const _ = require('lodash');
const React = require('react');
const SnowgridParameters = require('js/snowgrid/parameters/SnowgridParameters');
const InfluenceCircle = require('js/lattice/components/InfluenceCircle');
const SnowgridPixel = require('js/snowgrid/components/SnowgridPixel');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const {MAX_SIZE, CELL_SIZE} = require('js/snowgrid/parameters/SnowgridConstants');

const tinycolor = require('tinycolor2');
const {ColorInfluence, RotationInfluence, SizeInfluence, SnowflakeInfluence} = require('js/lattice/state/Influence');

const SnowgridGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        snowgridParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            snowgridParameters: this.state.snowgridParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const snowgridParameters = new SnowgridParameters(mixboard, beatmathParameters);
        const pieceParameters = snowgridParameters;
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {pieceParameters});

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#f00'), channelNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#0f0'), channelNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), channelNumber: 2}),

            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: MAX_SIZE * 0.5}),
            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: MAX_SIZE * 0.5}),

            new SnowflakeInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, stateKey: 'length1', startValue: 6}),
            new SnowflakeInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, stateKey: 'length2', startValue: 6}),
            new SnowflakeInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, stateKey: 'width1', startValue: 2}),
            new SnowflakeInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, stateKey: 'width2', startValue: 6}),
            new SnowflakeInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, stateKey: 'offset2', startValue: 2}),

            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
        ];

        return {snowgridParameters, influences, refreshTimer};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.snowgridParameters.showInfluences,
            numRows: this.state.snowgridParameters.numRows,
            numColumns: this.state.snowgridParameters.numColumns,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        const numColumns = this.getParameterValue('numColumns');
        const useTriangularGrid = this.state.snowgridParameters.triangularGridPercent.getValue() >= 0.5;

        for (let row = -numRows; row <= numRows; row++) {
            let minColumn = -numColumns;
            let maxColumn = numColumns;
            if (useTriangularGrid) {
                minColumn += Math.floor((Math.abs(row)) / 2);
                maxColumn -= Math.floor((Math.abs(row) + 1) / 2);
            }

            for (let col = minColumn; col <= maxColumn; col++) {
                children.push(<SnowgridPixel row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <BeatmathFrame>
                <g>
                    {children}
                    {this.getParameterValue('showInfluences') && <g>
                        {_.map(this.state.influences, (influence, index) =>
                            <InfluenceCircle influence={influence} key={index} cellSize={CELL_SIZE} />
                        )}
                    </g>}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = SnowgridGrid;
