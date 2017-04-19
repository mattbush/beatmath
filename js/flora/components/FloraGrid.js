const _ = require('lodash');
const React = require('react');
const FloraParameters = require('js/flora/parameters/FloraParameters');
const InfluenceCircle = require('js/lattice/components/InfluenceCircle');
const FloraPixel = require('js/flora/components/FloraPixel');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const tinycolor = require('tinycolor2');
const {ColorInfluence, RotationInfluence, SizeInfluence, ApertureInfluence, RotundityInfluence} = require('js/lattice/state/Influence');

const Y_AXIS_SCALE = Math.sqrt(3);
const WALLOW_OFFSET_SCALE = 2;
const wallowHexGrid = require('js/wallow/WallowHexGrid');

const FloraGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        floraParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            floraParameters: this.state.floraParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const floraParameters = new FloraParameters(mixboard, beatmathParameters);
        const pieceParameters = floraParameters;
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {pieceParameters});

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: tinycolor('#f00'), lightNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: tinycolor('#0f0'), lightNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), lightNumber: 2}),

            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, min: 0.2, max: 1, startValue: 0.5}),
            new SizeInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, min: 0.2, max: 1, startValue: 0.5}),

            new ApertureInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.9, startValue: 32}),
            new ApertureInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.1, startValue: 96}),

            new RotundityInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.1, startValue: 32}),
            new RotundityInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.9, startValue: 96}),

            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.2, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.8, startRow: 0.2, startValue: 0}),
            new RotationInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: 0}),
        ];

        return {floraParameters, influences, refreshTimer};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.floraParameters.showInfluences,
            numRows: this.state.floraParameters.numRows,
            numColumns: this.state.floraParameters.numColumns,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        const numColumns = this.getParameterValue('numColumns');
        for (let row = 0; row <= numRows; row++) {
            for (let col = -numColumns; col <= numColumns; col++) {
                const wallowCell = wallowHexGrid[row][col + 7];
                if (wallowCell) {
                    const [xOffsetFromWallow, yOffsetFromWallow] = wallowCell.offsets;
                    const colAdjusted = (col * 2) + (row % 2 ? 0.5 : -0.5) + xOffsetFromWallow * WALLOW_OFFSET_SCALE;
                    const rowAdjusted = (row - 3) * Y_AXIS_SCALE + yOffsetFromWallow * WALLOW_OFFSET_SCALE;

                    children.push(<FloraPixel row={rowAdjusted} col={colAdjusted} key={row + '|' + col} />);
                }
            }
        }

        return (
            <BeatmathFrame>
                <g transform="scale(38) translate(0, -1.78)">
                    {children}
                    {this.getParameterValue('showInfluences') && <g>
                        {_.map(this.state.influences, (influence, index) =>
                            <InfluenceCircle influence={influence} key={index} />
                        )}
                    </g>}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = FloraGrid;
