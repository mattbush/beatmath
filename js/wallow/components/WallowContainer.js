const _ = require('lodash');
const React = require('react');
const WallowParameters = require('js/wallow/parameters/WallowParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const Hex = React.createClass({
    render() {
        if (this.props.row % 2 && this.props.column === _.size(hexGrid[0]) - 1) {
            return null;
        }
        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0);
        const ty = this.props.row * Y_AXIS_SCALE;
        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${1 / 12}, -${1 / 8 * 4 / 3 * Y_AXIS_SCALE})`}}>
                <polygon className="line" points="0,4 6,2 6,-2 0,-4 -6,-2 -6,2" />
                <g style={{}}>
                    {hexGrid[this.props.row][this.props.column].map((polygon, index) => {
                        return <polygon className="mine" key={index} fill={polygon.color} points={polygon.points} />;
                    })}
                </g>
                <text style={{transform: 'scale(2, -1) translate(-2px, 2px)', fill: '#fff', fontSize: '2px'}}>{this.props.column}</text>
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
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                return <Hex row={row} column={column} />;
            });
        });

        return (
            <BeatmathFrame>
                <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                    {componentGrid}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = WallowContainer;
