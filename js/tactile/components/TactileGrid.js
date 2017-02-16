const _ = require('lodash');
const React = require('react');
const TactileParameters = require('js/tactile/parameters/TactileParameters');
const InfluenceCircle = require('js/lattice/components/InfluenceCircle');
const TactilePixel = require('js/tactile/components/TactilePixel');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const LatticeRefreshTimer = require('js/lattice/state/LatticeRefreshTimer');

const tinycolor = require('tinycolor2');
const {ColorInfluence} = require('js/lattice/state/Influence');

const TactileGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        tactileParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            tactileParameters: this.state.tactileParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const tactileParameters = new TactileParameters(mixboard, beatmathParameters);
        const pieceParameters = tactileParameters;
        const refreshTimer = new LatticeRefreshTimer(mixboard, beatmathParameters, {pieceParameters});

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.25, startRow: 0.25, startValue: tinycolor('#f00'), lightNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.75, startRow: 0.25, startValue: tinycolor('#0f0'), lightNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.25, startRow: 0.75, startValue: tinycolor('#00f'), lightNumber: 2}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.75, startRow: 0.75, startValue: tinycolor('#ff0'), lightNumber: 3}),
        ];

        return {tactileParameters, influences, refreshTimer};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.tactileParameters.showInfluences,
            numRows: this.state.tactileParameters.numRows,
            numColumns: this.state.tactileParameters.numColumns,
        };
    },
    render: function() {
        const children = [];
        const numRows = this.getParameterValue('numRows');
        const numColumns = this.getParameterValue('numColumns');
        for (let row = -numRows; row <= numRows; row++) {
            for (let col = -numColumns; col <= numColumns; col++) {
                children.push(<TactilePixel row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <BeatmathFrame>
                <g>
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

module.exports = TactileGrid;
