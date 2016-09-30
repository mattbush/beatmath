const React = require('react');
const WallowParameters = require('js/wallow/parameters/WallowParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const Hex = React.createClass({
    render() {
        if (this.props.row % 2 && this.props.column === hexGrid[0].length - 1) {
            return null;
        }
        const tx = this.props.column + (this.props.row % 2 ? 0.5 : 0);
        const ty = this.props.row * Y_AXIS_SCALE;
        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${1 / 12}, -${1 / 8 * 4 / 3 * Y_AXIS_SCALE}) translate(-6px,-4px)`}}>
                <polygon className="line" points="6,8 12,6 12,2 6,0 0,2 0,6" />
                <g style={{}}>
                    {hexGrid[this.props.row][this.props.column].map(polygon => {
                        return <polygon className="mine" fill={polygon.color} points={polygon.points} />;
                    })}
                </g>
            </g>
        );
    },
});

const WallowContainer = React.createClass({
    childContextTypes: {
        wallowParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            wallowParameters: this.state.wallowParameters,
        };
    },
    getInitialState: function() {
        return {
            wallowParameters: new WallowParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        const componentGrid = hexGrid.map((hexes, row) => {
            return hexes.map((hex, column) => {
                return <Hex row={row} column={column} />;
            });
        });

        return (
            <BeatmathFrame>
                <g style={{transform: `scale(76) translate(${-(hexGrid[0].length - 1) / 2}px, ${-(hexGrid.length) / 2}px)`}}>
                    {componentGrid}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = WallowContainer;
