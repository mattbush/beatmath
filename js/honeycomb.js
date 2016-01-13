var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor2');
var updateHue = require('js/outputs/updateHue');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants');

const BPM_CONST = 128;

const ROTATIONS_IN_SET = 32;

const COLORS = [tinycolor('#f00'), tinycolor('#1a1'), tinycolor('#36f')];

const SIX_RANGE = [0, 1, 2, 3, 4, 5];

var NUM_CORES = 3;

var ENABLE_HUE = false;
var SAT_COEFF = 1.5;
var BRI_COEFF = 0.6;

let AnimationControlledMixin = {
    contextTypes: {
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
    },
};

let Hexagon = React.createClass({
    render: function() {
        return (
            <polygon className="line" points="1,0 0.5,.866 -0.5,.866 -1,0 -0.5,-.866 0.5,-.866" />
        );
    }
});

let MagicCircle = React.createClass({
    mixins: [AnimationControlledMixin],
    getStyle: function(ticks) {
//        var scale = ticks % 2;
        var scale = (this.props.index % 3 === ticks % 3) ? 1 : 0;
        var transformDuration = this.context.period * (this.props.order / 3);
        return {
            transform: `scale(${scale})`,
            transition: `transform ${transformDuration}s ease`,
        };
    },
    render: function() {
//        var r = this.props.order * 0.05;
        return (
            <circle className="magicCircle" cx="0" cy="0" r="0.2px" style={this.getStyle(this.context.ticks + 1)} />
        );
    }
});

let MagicHexagon = React.createClass({
    render: function() {
        return (
            <g>
                <Hexagon />
                <MagicCircle index={this.props.index} order={this.props.order} />
            </g>
        );
    }
});

const HEX_HEIGHT = 1.732;
const HEX_HEIGHT_X2 = HEX_HEIGHT * 2;
const HEX_HEIGHT_X3 = HEX_HEIGHT * 3;
const HEX_HEIGHT_X4 = HEX_HEIGHT * 4;
const HEX_HEIGHT_X5 = HEX_HEIGHT * 5;

let HexagonGroup = React.createClass({
    mixins: [AnimationControlledMixin],
    getStyle: function(ticks) {
        var color = COLORS[(ticks + this.props.index) % COLORS.length];
        var transformDuration = this.context.period;
        return {
            stroke: color,
            transition: `transform ${transformDuration}s linear`,
        };
    },
    render: function() {
        var style = this.getStyle(this.context.ticks + 1);
        if (ENABLE_HUE) {
            updateHue(this.props.index, tinycolor(style.stroke), {satCoeff: SAT_COEFF, briCoeff: BRI_COEFF});
        }
        return (
            <g className="hexagonGroup" style={style}>
                <g transform={`translate(0 ${HEX_HEIGHT})`}>
                    <MagicHexagon index={this.props.index} order={1} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X2})`}>
                    <MagicHexagon index={this.props.index} order={2} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X3})`}>
                    <MagicHexagon index={this.props.index} order={3} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X4})`}>
                    <MagicHexagon index={this.props.index} order={4} />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X5})`}>
                    <MagicHexagon index={this.props.index} order={5} />
                </g>
            </g>
        );
    }
});

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
        var children = SIX_RANGE.map(x =>
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

var AnimationController = React.createClass({
    getInitialState: function() {
        return {ticks: 0};
    },
    componentWillMount: function() {
        this._startTime = Date.now();
    },
    childContextTypes: {
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
    },
    getChildContext: function() {
        return {
            bpm: this.props.bpm,
            period: this._getPeriod(),
            ticks: this.state.ticks,
        };
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
        return 60 / this.props.bpm;
    },
    render: function() {
        return (
            <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="main">
                <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`}>
                    {this.props.children}
                </g>
            </svg>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <div className="main">
            <AnimationController bpm={BPM_CONST}>
                {_.times(NUM_CORES, i => {
                    var xOffset = WIDTH_PX / NUM_CORES * (i - (NUM_CORES - 1) / 2);
                    return (
                        <g key={i} transform={`translate(${xOffset}, 0) scale(${1 / NUM_CORES})`}>
                            <RotatingCore />
                        </g>
                    );
                })}
            </AnimationController>
        </div>,
        document.getElementById('start')
    );
});
