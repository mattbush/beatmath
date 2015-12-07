var React = require('react');
var ReactDOM = require('react-dom');
var tinycolor = require('tinycolor');

// var ColorPixel = React.createClass({
//     _getInitialTimeout: function() {
//         var rowMod10 = this.props.row % 10;
//         var colMod10 = this.props.col % 10;
//         rowMod10 = (rowMod10 > 5) ? (10 - rowMod10) : rowMod10;
//         colMod10 = (colMod10 > 5) ? (10 - colMod10) : colMod10;
//         return ((0.5 + rowMod10 + colMod10) / 10) * fullTimeout;
//     },
//     componentDidMount: function() {
//         setTimeout(this._updateColor, this._getInitialTimeout());
//     },
//     _updateColor: function() {
//         setTimeout(this._updateColor, fullTimeout);
//         this.setState({
//             color: this.props.colorMixer.mixColors(this.state.color, this.props.row, this.props.col),
//         });
//     },
//     getInitialState: function() {
//         return {
//             color: gray,
//         };
//     },
//     render: function() {
//         var style = {
//             top: CELL_SIZE * this.props.row,
//             left: CELL_SIZE * this.props.col,
//             background: this.state.color.toHexString(true),
//         };
//         return (
//             <div className="colorPixel" style={style} />
//         );
//     },
// });

const BPM_CONST = 120;

const COLORS = [tinycolor('#f00'), tinycolor('#2b2'), tinycolor('#66f')];

const SIX_RANGE = [0, 1, 2, 3, 4, 5];

let AnimationControlledMixin = {
    contextTypes: {
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
        isInitializing: React.PropTypes.bool,
    },
    getStyle: function() {
        if (this.context.isInitializing) {
            return this.getInitializationStyle(this.context.ticks);
        } else {
            return this.getTransitionStyle(this.context.ticks + 1);
        }
    },
};

let Hexagon = React.createClass({
    render: function() {
        return (
            <polygon className="line" points="1,0 0.5,.866 -0.5,.866 -1,0 -0.5,-.866 0.5,-.866" />
        );
    }
});

const HEX_HEIGHT = 1.732;
const HEX_HEIGHT_X2 = HEX_HEIGHT * 2;

let HexagonGroup = React.createClass({
    render: function() {
        return (
            <g>
                <g transform={`translate(0 ${HEX_HEIGHT})`}>
                    <Hexagon />
                </g>
                <g transform={`translate(0 ${HEX_HEIGHT_X2})`}>
                    <Hexagon />
                </g>
            </g>
        );
    }
});

const ROTATION_SPEED = 15;

let RotatingCore = React.createClass({
    mixins: [AnimationControlledMixin],
    getInitializationStyle: function(ticks) {
        var rotationDegrees = ROTATION_SPEED * ticks;
        var scale = 100 - (ticks % 2) * 40;
        var color = COLORS[ticks % COLORS.length];
        return {
            transform: `rotate(${rotationDegrees}deg) scale(${scale})`,
            stroke: color,
        };
    },
    getTransitionStyle: function(ticks) {
        var transformDuration = this.context.period;
        var rotationDegrees = ROTATION_SPEED * ticks;
        var scale = 100 - (ticks % 2) * 40;
        var color = COLORS[ticks % COLORS.length];
        var ease = ticks % 2 ? 'ease-out' : 'ease-in';
        return {
            transform: `rotate(${rotationDegrees}deg) scale(${scale})`,
            transition: `transform ${transformDuration}s ${ease}, stroke ${transformDuration}s linear`,
            stroke: color,
        };
    },
    render: function() {
        var children = SIX_RANGE.map(x =>
            <g key={x} transform={`rotate(${x * 60})`}>
                <HexagonGroup />
            </g>
        );
        return (
            <g className="rotatingCore" style={this.getStyle()}>
                {children}
            </g>
        );
    },
});

var AnimationController = React.createClass({
    getInitialState: function() {
        return {ticks: 0, isInitializing: true};
    },
    componentWillMount: function() {
        this._startTime = Date.now();
    },
    childContextTypes: {
        bpm: React.PropTypes.number,
        ticks: React.PropTypes.number,
        period: React.PropTypes.number,
        isInitializing: React.PropTypes.bool,
    },
    getChildContext: function() {
        return {
            bpm: this.props.bpm,
            period: this._getPeriod(),
            ticks: this.state.ticks,
            isInitializing: this.state.isInitializing,
        };
    },
    componentDidMount: function() {
        setTimeout(this._enterTransitionState, 1);
    },
    componentDidUpdate: function() {
        if (this.state.isInitializing) {
            setTimeout(this._enterTransitionState, 1);
        } else {
            const targetTime = this._startTime + 1000 * this._getPeriod() * (this.state.ticks + 1);
            const timeout = targetTime - Date.now();
            setTimeout(this._tick, timeout);
        }
    },
    _enterTransitionState: function() {
        this.setState({isInitializing: false});
    },
    _tick: function() {
        this.setState({isInitializing: true, ticks: this.state.ticks + 1});
    },
    _getPeriod: function() {
        return 60 / this.props.bpm;
    },
    render: function() {
        return (
            <svg width="1280" height="800" className="main">
                <g transform="translate(640,400)">
                    {this.props.children}
                </g>
            </svg>
        );
    },
});

ReactDOM.render(
    <AnimationController bpm={BPM_CONST}>
        <RotatingCore />
    </AnimationController>,
    document.getElementById('start')
);
