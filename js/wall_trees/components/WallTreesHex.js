const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const WallTreesHex = React.createClass({
    contextTypes: {
        wallTreesParameters: React.PropTypes.object,
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
                {shapes.map((polygon, index) => {
                    const fill = this.context.wallTreesParameters.getColorForRowAndColumnAndPolygon(this.props.row, this.props.column, polygon);
                    return <polygon className="mine" key={index} fill={fill} points={polygon.points} />;
                })}
            </g>
        );
    },
});

module.exports = WallTreesHex;
