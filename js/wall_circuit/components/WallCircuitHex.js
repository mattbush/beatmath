const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const WallCircuitHex = React.createClass({
    contextTypes: {
        wallCircuitParameters: React.PropTypes.object,
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
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${cell.scale}) rotate(${cell.rotation}deg)`}}>
                {shapes.map((polygon, index) => {
                    let dy = 0;
                    if (polygon.center[0] === 0 && polygon.center[1] === 0) {
                        dy = polygon.yMax / 2;
                    }
                    const column = (tx + polygon.center[0] - 7) / Y_AXIS_SCALE;
                    const row = -(ty + polygon.center[1] + dy - 1.5) * 2;

                    const fill = this.context.wallCircuitParameters.getColorForColumnAndRow(column, row);
                    return <polygon className="mine" key={index} fill={fill} points={polygon.points} />;
                })}
            </g>
        );
    },
});

module.exports = WallCircuitHex;
