const _ = require('lodash');
const React = require('react');
const WallowParameters = require('js/wallow/parameters/WallowParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');

const hexGrid = _.times(7, () => _.times(16, () => {}));

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const Hex = React.createClass({
    render() {
        if (this.props.row % 2 && this.props.column === hexGrid[0].length - 1) {
            return null;
        }
        const tx = this.props.column + (this.props.row % 2 ? 0.5 : 0);
        const ty = this.props.row * Y_AXIS_SCALE;
        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(1, ${Y_AXIS_SCALE})`}}>
                <polygon className="line" points="0,.667 .5,.333 .5,-.333 0,-.667 -.5,-.333 -.5,.333" />
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
