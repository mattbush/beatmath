var _ = require('underscore');
var React = require('react');

let HoneycombParameters = require('js/honeycomb/parameters/HoneycombParameters');
let AnimationControlledMixin = require('js/honeycomb/components/AnimationControlledMixin');
let HexagonGroup = require('js/honeycomb/components/HexagonGroup');
var BeatmathFrame = require('js/core/components/BeatmathFrame');

const {WIDTH_PX} = require('js/core/parameters/BeatmathConstants');

const BPM_CONST = 128;

const ROTATIONS_IN_SET = 32;

const NUM_CORES = 3;

const ROTATION_SPEED = 15;

let RotatingCore = React.createClass({
    mixins: [AnimationControlledMixin],
    getStyle: function(ticks) {
        var transformDuration = this.context.period;
        var rotationDegrees;
        if (ticks % ROTATIONS_IN_SET >= ROTATIONS_IN_SET / 2) {
            rotationDegrees = (ROTATIONS_IN_SET - (ticks % ROTATIONS_IN_SET)) * ROTATION_SPEED;
        } else {
            rotationDegrees = (ticks % ROTATIONS_IN_SET) * ROTATION_SPEED;
        }
        var scale = 100 - (ticks % 2) * 40;
        var ease = ticks % 2 ? 'ease' : 'ease';
        return {
            transform: `rotate(${rotationDegrees}deg) scale(${scale})`,
            transition: `transform ${transformDuration}s ${ease}`,
        };
    },
    render: function() {
        var children = _.times(6, x =>
            <g key={x} transform={`rotate(${x * 60})`}>
                <HexagonGroup index={x} />
            </g>
        );
        return (
            <g className="rotatingCore" style={this.getStyle(this.context.ticks + 1)}>
                {children}
            </g>
        );
    },
});

var HoneycombContainer = React.createClass({
    childContextTypes: {
        honeycombParameters: React.PropTypes.object,
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            honeycombParameters: this.state.honeycombParameters,
            bpm: this.state.bpm,
            period: this._getPeriod(),
            ticks: this.state.ticks,
        };
    },
    getInitialState: function() {
        return {
            honeycombParameters: new HoneycombParameters(this.context.mixboard),
            ticks: 0,
            bpm: BPM_CONST,
        };
    },
    componentWillMount: function() {
        this._startTime = Date.now();
    },
    componentDidMount: function() {
        this._setTimer();
    },
    componentDidUpdate: function() {
        this._setTimer();
    },
    _setTimer: function() {
        const targetTime = this._startTime + 1000 * this._getPeriod() * (this.state.ticks + 1);
        const timeout = targetTime - Date.now();
        setTimeout(this._tick, timeout);
    },
    _tick: function() {
        this.setState({ticks: this.state.ticks + 1});
    },
    _getPeriod: function() {
        return 60 / this.state.bpm;
    },
    render: function() {
        return (
            <BeatmathFrame>
                {_.times(NUM_CORES, i => {
                    var xOffset = WIDTH_PX / NUM_CORES * (i - (NUM_CORES - 1) / 2);
                    return (
                        <g key={i} transform={`translate(${xOffset}, 0) scale(${1 / NUM_CORES})`}>
                            <RotatingCore />
                        </g>
                    );
                })}
            </BeatmathFrame>
        );
    },
});

module.exports = HoneycombContainer;
