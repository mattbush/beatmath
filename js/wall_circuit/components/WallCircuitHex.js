const _ = require('lodash');
const React = require('react');
// const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');
const {posModAndBendToLowerHalf, posMod} = require('js/core/utils/math');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const WallCircuitHex = React.createClass({
    contextTypes: {
        wallCircuitParametersByChannel: React.PropTypes.array,
    },
    componentWillMount() {
        this._ghostState = Math.random();
    },
    componentDidMount() {
        setInterval(this._update, 100);
    },
    _update() {
        this._ghostState = posMod(this._ghostState + Math.random() * 0.001, 1);
    },
    render() {
        if (this.props.row % 2 && this.props.column === _.size(hexGrid[0]) - 1) {
            return null;
        }
        const cell = hexGrid[this.props.row][this.props.column];

        const tx = Number(this.props.column) + (this.props.row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = this.props.row * Y_AXIS_SCALE + cell.offsets[1];

        const ghostNum = posMod(this.props.row, 2) * 2 + posMod(this.props.column, 2);
        const ghostTransform = ((this.props.row + this.props.column) % 2) ? 'scale(-1,1)' : null;

        const ghostStateDepth = this._ghostState >= 0.92 ? posModAndBendToLowerHalf(this._ghostState - 0.92, 0.08) * 25 : 0;

        return (
            <g style={{transform: `translate(${tx}px, ${ty}px) scale(${cell.scale}) rotate(${cell.rotation}deg)`}}>
                {cell.edges.map((edge, index) => {
                    let lineOpacity = 1;
                    if (index >= 3 && ghostStateDepth > 0) {
                        lineOpacity = Math.max(1 - ghostStateDepth * 2, 0);
                    }
                    // TODO: skip/opacify most edges if a ghost is present

                    const column = (tx + edge.center[0] - 7) / Y_AXIS_SCALE;
                    const row = -(ty + edge.center[1] - 1.5) * 2;

                    const color = this.context.wallCircuitParametersByChannel[edge.channel].getColorForColumnAndRow(column, row);

                    const points = _.pick(edge, 'x1', 'x2', 'y1', 'y2');
                    return (
                        <line {...points} style={{opacity: lineOpacity}} className="edge" key={index} stroke={mapColorString(color)} />
                    );
                })}}
                {this._ghostState >= 0.92 &&
                    <image
                        xlinkHref={`images/wallow/ghost${ghostNum}.png`}
                        style={{opacity: ghostStateDepth}}
                        transform={ghostTransform} x="-0.35" y="-0.4" height="0.7px" width="0.7px"
                    />
                }
            </g>
        );
    },
});

module.exports = WallCircuitHex;
