var _ = require('underscore');
var React = require('react');
var tinycolor = require('tinycolor2');
var BeatmathPixel = require('js/core/components/BeatmathPixel');
var {runAtTimestamp} = require('js/core/utils/time');
var {lerp} = require('js/core/utils/math');

const {CELL_SIZE, PIXEL_REFRESH_RATE} = require('js/lattice/parameters/LatticeConstants');

const SQRT_3_OVER_2 = Math.sqrt(3) / 2;
const SQRT_SQRT_3_OVER_2 = Math.sqrt(SQRT_3_OVER_2);

var gray = tinycolor('#909090');

var calculateRowTriangular = function(row) {
    return row * SQRT_SQRT_3_OVER_2;
};
var calculateColTriangular = function(row, col) {
    var val = (row % 2) ? (col + 0.25) : (col - 0.25);
    return val / SQRT_SQRT_3_OVER_2;
};

var LatticePixel = React.createClass({
    contextTypes: {
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentDidMount: function() {
        var nextTick = this.context.latticeParameters.nextTick;
        var refreshOffset = this._getRefreshOffset();
        runAtTimestamp(this._update, nextTick.getValue() + refreshOffset);
    },
    getInitialState: function() {
        var rowTriangular = calculateRowTriangular(this.props.row, this.props.col);
        var colTriangular = calculateColTriangular(this.props.row, this.props.col);
        var triangularGridAmount = this.context.latticeParameters.triangularGridAmount.getValue();
        return {
            rowTriangular,
            colTriangular,
            triangularGridAmount,
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
            rowComputed: lerp(this.props.row, rowTriangular, triangularGridAmount),
            colComputed: lerp(this.props.col, colTriangular, triangularGridAmount),
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        var nextTick = this.context.latticeParameters.nextTick;
        var triangularGridAmount = this.context.latticeParameters.triangularGridAmount.getValue();

        var refreshOffset = this._getRefreshOffset();
        if (nextTick.getNumTicks() % 2 &&
            this.context.latticeParameters.oscillate.getValue()) {
            refreshOffset = PIXEL_REFRESH_RATE - refreshOffset;
        }
        runAtTimestamp(this._update, nextTick.getValue() + refreshOffset);

        this._nextState = _.clone(this.state);
        if (triangularGridAmount !== this.state.triangularGridAmount) {
            this._nextState.triangularGridAmount = triangularGridAmount;
            this._nextState.rowComputed = lerp(this.props.row, this.state.rowTriangular, triangularGridAmount);
            this._nextState.colComputed = lerp(this.props.col, this.state.colTriangular, triangularGridAmount);
        }

        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        this.setState(this._nextState);
    },
    _getRefreshOffset: function() {
        // just use one or the other, rather than a mix, to take advantage of the cache
        var useTriangularGrid = this.context.latticeParameters.triangularGridAmount.getValue() >= 0.5;
        return this.context.refreshTimer.getRefreshOffset(
            useTriangularGrid ? this.state.rowTriangular : this.props.row,
            useTriangularGrid ? this.state.colTriangular : this.props.col,
        );
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.state.rowComputed, this.state.colComputed);
    },
    render: function() {
        var rotation = Math.floor(this.state.rotation);
        var x = this.state.colComputed * CELL_SIZE;
        var y = this.state.rowComputed * CELL_SIZE;
        var fill = this.state.color;

        var style = {
            transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${this.state.size / 2})`,
        };

        return (
            <g style={style}>
                <BeatmathPixel color={fill} />
            </g>
        );
    },
});

module.exports = LatticePixel;
