var _ = require('underscore');
var React = require('react');
var tinycolor = require('tinycolor2');
var BeatmathPixel = require('js/components/BeatmathPixel');
var {runAtTimestamp} = require('js/utils/time');

const {CELL_SIZE, PIXEL_REFRESH_RATE} = require('js/parameters/lattice/LatticeConstants');

var gray = tinycolor('#909090');

var LatticePixel = React.createClass({
    contextTypes: {
        latticeParameters: React.PropTypes.object,
        influences: React.PropTypes.array,
        refreshTimer: React.PropTypes.object,
    },
    componentDidMount: function() {
        var nextTick = this.context.latticeParameters.nextTick;
        var refreshOffset = this.context.refreshTimer.getRefreshOffset(this.props.row, this.props.col);
        runAtTimestamp(this._update, nextTick.getValue() + refreshOffset);
    },
    getInitialState: function() {
        return {
            color: gray,
            size: CELL_SIZE * 0.4,
            rotation: 0,
        };
    },
    _update: function() {
        if (!this.isMounted()) {
            return;
        }
        var nextTick = this.context.latticeParameters.nextTick;
        var refreshOffset = this.context.refreshTimer.getRefreshOffset(this.props.row, this.props.col);
        if (nextTick.getNumTicks() % 2 &&
            this.context.latticeParameters.oscillate.getValue()) {
            refreshOffset = PIXEL_REFRESH_RATE - refreshOffset;
        }
        runAtTimestamp(this._update, nextTick.getValue() + refreshOffset);

        this._nextState = _.clone(this.state);
        _.each(this.context.influences, this._mixInfluenceIntoNextState);
        this.setState(this._nextState);
    },
    _mixInfluenceIntoNextState: function(influence) {
        return influence.mix(this._nextState, this.props.row, this.props.col);
    },
    render: function() {
        var rotation = Math.floor(this.state.rotation);
        var x = this.props.col * CELL_SIZE;
        var y = this.props.row * CELL_SIZE;
        var fill = this.state.color.toHexString(true);

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
