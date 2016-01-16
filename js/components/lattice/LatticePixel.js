var _ = require('underscore');
var React = require('react');
var tinycolor = require('tinycolor2');
var latticeRefreshAlgorithm = require('js/state/lattice/latticeRefreshAlgorithm');

const {CELL_SIZE, PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');

var gray = tinycolor('#909090');

var LatticePixel = React.createClass({
    contextTypes: {
        influences: React.PropTypes.array,
    },
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
        _.each(this.context.influences, influence => influence.mix(state, this.props.row, this.props.col));
        this.setState(state);
    },
    render: function() {
        var rotation = Math.floor(this.state.rotation);
        var x = this.props.col * CELL_SIZE;
        var y = this.props.row * CELL_SIZE;
        var transform = `translate(${x} ${y}) rotate(${rotation})`;
        var fill = this.state.color.toHexString(true);
        var pixelOffset = -this.state.size / 2;
        return (
            <rect x={pixelOffset} y={pixelOffset} width={this.state.size} height={this.state.size} fill={fill} transform={transform} />
        );
    },
});

module.exports = LatticePixel;
