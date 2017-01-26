const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const {posMod} = require('js/core/utils/math');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const Hex = React.createClass({
    getInitialState() {
        return {
            ghostState: Math.random(),
        };
    },
    componentDidMount() {
        setInterval(this._update.bind(this), 100);
    },
    _update() {
        this.setState({ghostState: posMod(this.state.ghostState + Math.random() * 0.001, 1)});
    },
    render() {
        if (this.props.row % 2 && this.props.column === _.size(hexGrid[0]) - 1) {
            return null;
        }
        const cell = hexGrid[this.props.row][this.props.column];
        const shapes = cell.shapes;

        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = this.props.row * Y_AXIS_SCALE + cell.offsets[1];

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px)`}}>
                {shapes.map((polygon, index) =>
                    <polygon className="mine" key={index} fill="transparent" points={polygon.points} />
                )}
            </g>
        );
    },
});

const WallSnowstormGrid = React.createClass({
    render() {
        const componentGrid = _.map(hexGrid, (hexes, row) => {
            return _.map(hexes, (hex, column) => {
                return <Hex row={row} column={column} />;
            });
        });

        return (
            <g style={{transform: `scale(76) translate(${-(_.size(hexGrid[0]) - 1) / 2}px, ${-_.size(hexGrid) / 2}px)`}}>
                {componentGrid}
            </g>
        );
    },
});

module.exports = WallSnowstormGrid;
