const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const WallLatticePixel = require('js/wall_lattice/components/WallLatticePixel');

const hexGrid = require('js/wallow/WallowHexGrid');

const SHOW_EDGES = true;
const SHOW_SHAPES = false;

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const WallLatticeHex = React.createClass({
    render() {
        if (this.props.row % 2 && this.props.column === _.size(hexGrid[0]) - 1) {
            return null;
        }
        const containsLatencyMaster = Number(this.props.row) === 0 && (Number(this.props.column) === 0 || Number(this.props.column) === 1);
        const cell = hexGrid[this.props.row][this.props.column];
        const {shapes, edges} = cell;

        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = this.props.row * Y_AXIS_SCALE + cell.offsets[1];

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${cell.scale}) rotate(${cell.rotation}deg)`}}>
                {SHOW_SHAPES && shapes.map((polygon, index) => {
                    return <WallLatticePixel type="polygon" key={index} tx={tx} ty={ty} polygonOrEdge={polygon} isLatencyMaster={containsLatencyMaster && index === 0} />;
                    // const color = tinycolor('#AA5555').saturate(100 * polygon.center[0]).lighten(100 * polygon.yMax);
                    // return <polygon className="mine" key={index} fill={`#fff`} style={{opacity: '0.5'}} points={polygon.points} />;
                })}
                {SHOW_EDGES && edges.map((edge, index) => {
                    return <WallLatticePixel type="edge" key={index} tx={tx} ty={ty} polygonOrEdge={edge} isLatencyMaster={containsLatencyMaster && !SHOW_SHAPES && index === 0} />;
                })}
            </g>
        );
    },
});

module.exports = WallLatticeHex;
