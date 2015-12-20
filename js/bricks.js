var React = require('react');
var ReactDOM = require('react-dom');

const {WIDTH_PX, HEIGHT_PX} = require('./beatmath_constants.js');

const INV_SQRT_3 = 1 / Math.sqrt(3);
const TWO_X_INV_SQRT_3 = 2 / Math.sqrt(3);

var Triangle = React.createClass({
    render: function() {
        var x = this.props.x * INV_SQRT_3;
        var y = this.props.y;

        var fill = '#ff0000';

        return (
            <polygon fill={fill} points={`${x + INV_SQRT_3},${y + 1} ${x - TWO_X_INV_SQRT_3},${y} ${x + INV_SQRT_3},${y - 1}`} />
        );
    },
});

var BrickGrid = React.createClass({
    render: function() {
        return (
            <svg width={WIDTH_PX} height={HEIGHT_PX} className="brickGrid">
                <g transform={`translate(${WIDTH_PX / 2}, ${HEIGHT_PX / 2}) scale(100)`}>
                    <Triangle x={0} y={0} />
                </g>
            </svg>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
        <BrickGrid />
      </div>,
      document.getElementById('start')
    );
});
