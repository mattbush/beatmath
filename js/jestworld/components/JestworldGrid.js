const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const {posMod} = require('js/core/utils/math');

const hexGrid = require('js/wallow/WallowHexGrid');
const jestworldHexGrid = require('js/jestworld/JestworldHexGrid');

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

        const jestShape = jestworldHexGrid[this.props.row][this.props.column];

        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = this.props.row * Y_AXIS_SCALE + cell.offsets[1];

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px)`}}>
                {jestShape && <polygon fill="#fff" points={jestShape.points} />}
                <g style={{transform: `scale(${1 / 12}, -${1 / 8 * 4 / 3 * Y_AXIS_SCALE})`}}>
                    <polygon className="line" points="0,4 6,2 6,-2 0,-4 -6,-2 -6,2" />
                </g>
                <g style={{}}>
                    {shapes.map((polygon, index) => {
                        // const color = tinycolor('#AA5555').saturate(100 * polygon.center[0]).lighten(100 * polygon.yMax);
                        // return <polygon className="mine" key={index} fill={`#fff`} style={{opacity: '0.5'}} points={polygon.points} />;
                        return <polygon className="mine" key={index} fill="transparent" points={polygon.points} />;
                    })}
                </g>
                <text style={{transform: 'scale(0.15, 0.15) translate(-2px, 2px)', fill: '#fff', fontSize: '2px'}}>{this.props.column}</text>
            </g>
        );
    },
});

const JestworldGrid = React.createClass({
    render: function() {
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

module.exports = JestworldGrid;
