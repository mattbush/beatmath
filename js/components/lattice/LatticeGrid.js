var _ = require('underscore');
var React = require('react');
var tinycolor = require('tinycolor2');
const InfluenceCircle = require('js/components/lattice/InfluenceCircle');
const latticeRefreshAlgorithm = require('js/state/lattice/latticeRefreshAlgorithm');

const {WIDTH_PX, HEIGHT_PX, CELL_SIZE, PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');

const SHOW_INFLUENCES = false;

var gray = tinycolor('#909090');

var LatticePixel = React.createClass({
    componentDidMount: function() {
        this._refreshOffset = latticeRefreshAlgorithm(this.props.row, this.props.col);
        setInterval(this._update, this._refreshOffset);
    },
    getInitialState: function() {
        return {
            color: gray,
            size: 8,
            rotation: 0,
        };
    },
    _update: function() {
        // whether to oscillate (for diamonds/sectors)
        // setTimeout(this._update, PIXEL_REFRESH_RATE * 2 - this._refreshOffset * 2);
        this._refreshOffset = PIXEL_REFRESH_RATE - this._refreshOffset;
        var state = _.clone(this.state);
        _.each(this.props.influences, influence => influence.mix(state, this.props.row, this.props.col));
        this.setState(state);
    },
    render: function() {
        var rotation = Math.floor(this.state.rotation);
        var x = this.props.col * CELL_SIZE + CELL_SIZE / 2;
        var y = this.props.row * CELL_SIZE + CELL_SIZE / 2;
        var transform = `translate(${x} ${y}) rotate(${rotation})`;
        var fill = this.state.color.toHexString(true);
        var pixelOffset = -this.state.size / 2;
        return (
            <rect x={pixelOffset} y={pixelOffset} width={this.state.size} height={this.state.size} fill={fill} transform={transform} />
        );
    },
});

var LatticeGrid = React.createClass({
    render: function() {
        const children = [];
        for (let row = 0; row < this.props.numRows; row++) {
            for (let col = 0; col < this.props.numCols; col++) {
                children.push(<LatticePixel influences={this.props.influences} row={row} col={col} key={row + '|' + col} />);
            }
        }

        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="colorGrid">
                <g>
                    {children}
                </g>
                {SHOW_INFLUENCES && <g>
                    {_.map(this.props.influences, (influence, index) =>
                        <InfluenceCircle influence={influence} key={index} />
                    )}
                </g>}
            </svg>
        );
    },
});

module.exports = LatticeGrid;
