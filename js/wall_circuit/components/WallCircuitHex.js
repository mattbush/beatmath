const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const WallCircuitHex = React.createClass({
    contextTypes: {
        wallCircuitParametersByChannel: React.PropTypes.array,
    },
    render() {
        if (this.props.row % 2 && this.props.column === _.size(hexGrid[0]) - 1) {
            return null;
        }
        const cell = hexGrid[this.props.row][this.props.column];

        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = this.props.row * Y_AXIS_SCALE + cell.offsets[1];

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${cell.scale}) rotate(${cell.rotation}deg)`}}>
                {cell.edges.map((edge, index) => {
                    const column = (tx + edge.center[0] - 7) / Y_AXIS_SCALE;
                    const row = -(ty + edge.center[1] - 1.5) * 2;

                    const color = this.context.wallCircuitParametersByChannel[edge.channel].getColorForColumnAndRow(column, row);

                    const points = _.pick(edge, 'x1', 'x2', 'y1', 'y2');
                    return (
                        <line {...points} className="edge" key={index} stroke={mapColorString(color)} />
                    );
                })}}
            </g>
        );
    },
});

module.exports = WallCircuitHex;
