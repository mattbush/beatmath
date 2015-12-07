var React = require('react');

const {CELL_SIZE, MIXER_REFRESH_RATE} = require('./colors_constants');

var InfluenceCircle = React.createClass({
    componentDidMount: function() {
        this.props.mixer.addListener(this.forceUpdate);
    },
    render: function() {
        var circle = this.props.mixer.circles[this.props.index];
        var x = circle.col * CELL_SIZE + CELL_SIZE / 2;
        var y = circle.row * CELL_SIZE + CELL_SIZE / 2;
        var size = circle.size * 5;
        var style = {
            transition: `transform ${MIXER_REFRESH_RATE / 1000}s linear`,
            fill: circle.color.toHexString(true),
        };
        if (circle.rotation !== undefined) {
            var rotation = Math.floor(circle.rotation);
            let transform = `translate(${x} ${y}) rotate(${rotation})`;
            var pixelOffset = -size / 2;
            return (
                <g style={style} transform={transform}>
                    <rect x={pixelOffset} y={pixelOffset} width={size} height={size} />
                </g>

            );
        } else {
            let transform = `translate(${x} ${y})`;
            return (
                <g style={style} transform={transform}>
                    <circle cx={0} cy={0} r={size / 2} />
                </g>
            );
        }
    },
});

module.exports = InfluenceCircle;
