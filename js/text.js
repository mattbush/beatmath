var React = require('react');
var ReactDOM = require('react-dom');

// const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZETAOINSHRDLUETAOINCMFGYPETAOINSHRDLUETAOIN😁😂😆😉😍😎😋😘😏😴💁👍🙌💀🤖🐵🐷🐥🌲🌺☀️⛅🌟🌙🔥🌎";
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZETAOINSHRDLUETAOINCMFGYPETAOINSHRDLUETAOIN";
// const CHARACTERS = ['😁', '😂', '😆', '😉', '😍', '😎', '😋', '😘', '😏', '😴', '💁', '👍', '🙌', '💀', '🤖', '🐵', '🐷', '🐥', '🌲', '🌺', '⛅', '🌟', '🌙', '🔥', '🌎'];

const NUM_CHARS = 80;

var HEIGHT = 800;
var WIDTH = 1280;

var REFRESH_RATE_MS = 1000;

var COLORS = ['#ff6666', '#ffff22', '#66ff22', '#33ddff', '#4477ff', '#dd44ff', '#dddddd'];

function randRange(min, max) {
    var diff = max - min;
    return Math.random() * diff + min;
}

let Character = React.createClass({
    getInitialState: function() {
        return {
            x: WIDTH / 2,
            y: HEIGHT,
            dx: 0,
            dy: -0.5,
            character: CHARACTERS[0],
            fontSize: 30,
            characterIndex: 0.5,
            transform: 'rotate(0)',
        };
    },
    componentDidMount: function() {
        setTimeout(this._update, this._getInitialTimeout());
    },
    _fall: function() {
        setTimeout(this._reset, REFRESH_RATE_MS);
        this.setState({
            y: HEIGHT,
            transform: 'rotate(1000deg)',
        });
    },
    _reset: function() {
        setTimeout(this._update, REFRESH_RATE_MS);
        this.setState({
            x: WIDTH / 2,
            dx: 0,
            dy: -0.5,
            fontSize: 40,
            transform: 'rotate(0)',
            character: CHARACTERS[Math.floor(this.state.characterIndex) % CHARACTERS.length],
        });
    },
    _getInitialTimeout: function() {
        return (this.props.index / NUM_CHARS) * REFRESH_RATE_MS;
    },
    _update: function() {
        if (this.state.y <= -40) {
            this._fall();
            return;
        }
        setTimeout(this._update, REFRESH_RATE_MS);
        var dx = this.state.dx + randRange(-7, 7);
        var dy = this.state.dy + randRange(-10, 0);
        this.setState({
            x: this.state.x + dx,
            y: this.state.y + dy,
            dx,
            dy,
            fontSize: this.state.fontSize * randRange(1.02, 1.20),
            characterIndex: this.state.characterIndex * randRange(1, 1.05),
        });
    },
    render: function() {
        var style = {
            top: this.state.y,
            left: this.state.x,
            fontSize: this.state.fontSize,
            opacity: 0.5 + (Math.min(1, 40 / this.state.fontSize) * 0.5),
            transform: this.state.transform,
            color: COLORS[this.props.index % COLORS.length],
        };
        return (
            <div className="character" style={style}>{this.state.character}</div>
        );
    },
});

var CharacterSet = React.createClass({
    render: function() {
        var children = [];
        for (var i = 0; i < NUM_CHARS; i++) {
            children.push(
                <Character index={i} key={i} />
            );
        }
        return (
            <div className="characterSet">
                {children}
            </div>
        );
    },
});

document.addEventListener('DOMContentLoaded', function(e) {
    ReactDOM.render(
        <CharacterSet />,
        document.getElementById('start')
    );
});
