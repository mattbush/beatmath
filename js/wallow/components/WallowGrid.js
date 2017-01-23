const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const {posModAndBendToLowerHalf, posMod} = require('js/core/utils/math');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const DEBUG_MODE = true;
const OVERLAP_MODE = true;

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
        const ghostNum = this.props.row % 2 * 2 + (this.props.column % 2);
        const ghostTransform = ((this.props.row + this.props.column) % 2) ? 'scale(-1,1)' : null;

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px)`}}>
                {!DEBUG_MODE && this.state.ghostState >= 0.92 &&
                    <image
                        xlinkHref={`images/wallow/ghost${ghostNum}.png`}
                        style={{opacity: posModAndBendToLowerHalf(this.state.ghostState - 0.92, 0.08) * 25}}
                        transform={ghostTransform} x="-0.4" y="-0.4" height="0.8px" width="0.8px"
                    />
                }
                {DEBUG_MODE && !OVERLAP_MODE && <g style={{transform: `scale(${1 / 12}, -${1 / 8 * 4 / 3 * Y_AXIS_SCALE})`}}>
                    <polygon className="line" points="0,4 6,2 6,-2 0,-4 -6,-2 -6,2" />
                </g>}
                <g style={{}}>
                    {shapes.map((polygon, index) => {
                        if (DEBUG_MODE) {
                            // tinycolor('#AA5555').saturate(100 * polygon.center[0]).lighten(100 * polygon.yMax)
                            const color = OVERLAP_MODE ? '#fff' : polygon.color;
                            const opacity = OVERLAP_MODE ? 0.5 : 1;
                            return <polygon className="mine" key={index} fill={color} style={{opacity: opacity}} points={polygon.points} />;
                        } else {
                            return <polygon className="mine" key={index} fill="transparent" points={polygon.points} />;
                        }
                    })}
                </g>
                {DEBUG_MODE &&
                    <text style={{transform: 'scale(0.15, 0.15) translate(-2px, 2px)', fill: '#fff', fontSize: '2px'}}>{this.props.column}</text>
                }
            </g>
        );
    },
});

const WallowGrid = React.createClass({
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

module.exports = WallowGrid;
