const React = require('react');
const WallEarthdayParameters = require('js/wall_earthday/parameters/WallEarthdayParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const WallEarthdayGrid = require('js/wall_earthday/components/WallEarthdayGrid');
const tinycolor = require('tinycolor2');
const {ColorInfluence} = require('js/lattice/state/Influence');

const WallEarthdayContainer = React.createClass({
    childContextTypes: {
        wallEarthdayParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallEarthdayParameters: this.state.wallEarthdayParameters,
            influences: this.state.influences,
            refreshTimer: this.state.refreshTimer,
        };
    },
    getInitialState: function() {
        const mixboard = this.context.mixboard;
        const beatmathParameters = this.context.beatmathParameters;
        const wallEarthdayParameters = new WallEarthdayParameters(mixboard, beatmathParameters);
        const pieceParameters = wallEarthdayParameters;

        const influences = [
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.3, startRow: 0.8, startValue: tinycolor('#ff0'), channelNumber: 0}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.7, startRow: 0.2, startValue: tinycolor('#0f0'), channelNumber: 1}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.5, startRow: 0.8, startValue: tinycolor('#00f'), channelNumber: 2}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.1, startRow: 0.2, startValue: tinycolor('#f00'), channelNumber: 3}),
            new ColorInfluence({beatmathParameters, pieceParameters, startCol: 0.9, startRow: 0.8, startValue: tinycolor('#0ff'), channelNumber: 4}),
        ];

        return {wallEarthdayParameters, influences};
    },
    getParameterBindings: function() {
        return {
            showInfluences: this.state.latticeParameters.showInfluences,
            numRows: this.state.latticeParameters.numRows,
            numColumns: this.state.latticeParameters.numColumns,
        };
    },

    render: function() {
        return (
            <BeatmathFrame>
                <WallEarthdayGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = WallEarthdayContainer;
