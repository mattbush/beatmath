var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('./beatmath_constants');

const ARRANGEMENTS = [
    {
        height: 5,
        width: 5,
        goldX: [0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 4, 4, 5, 5],
        goldY: [0, 1, 0, 1, 4, 5, 4, 5, 2, 3, 2, 3, 0, 1, 0, 1, 4, 5, 4, 5],
        blueX: [0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3, 4, 4, 5, 5],
        blueY: [2, 3, 2, 3, 0, 1, 0, 1, 4, 5, 4, 5, 2, 3, 2, 3],
    },
    {
        height: 4,
        width: 14,
        goldX: [0, 1, 2, 1, 0, 0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 5, 4, 4, 4, 4],
        goldY: [0, 0, 1, 2, 3, 4, 4, 4, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 2, 1],
        blueX: [8, 9, 9, 9, 9, 8, 9, 10, 14, 13, 12, 12, 12, 13, 14, 13],
        blueY: [1, 0, 1, 2, 3, 4, 4, 4, 0, 0, 1, 2, 3, 4, 3, 2],
    },
];
const NUM_GOLD = 20;
const NUM_BLUE = 16;

const PIXEL_SPACING = 40;
const PIXEL_SIZE = 20;
const OFFSET_TRANSITION_TIME = 1000;

const TwentySixteenPixel = React.createClass({
    render: function() {
        var fill = this.props.color === 'gold' ? '#e90' : '#39f';
        return (
            <circle cx={this.props.x * PIXEL_SPACING} cy={this.props.y * PIXEL_SPACING} fill={fill} r={PIXEL_SIZE / 2} />
        );
    },
});

const TwentySixteen = React.createClass({
    getInitialState: function() {
        return {
            arrangementIndex: 1,
        };
    },
    render: function() {
        var arrangement = ARRANGEMENTS[this.state.arrangementIndex];
        var golds = _.times(NUM_GOLD, index =>
            <TwentySixteenPixel
                color="gold"
                key={index}
                x={arrangement.goldX[index]}
                y={arrangement.goldY[index]}
            />
        );
        var blues = _.times(NUM_BLUE, index =>
            <TwentySixteenPixel
                color="blue"
                key={index}
                x={arrangement.blueX[index]}
                y={arrangement.blueY[index]}
            />
        );

        var xOffset = -arrangement.width / 2 * PIXEL_SPACING;
        var yOffset = -arrangement.height / 2 * PIXEL_SPACING;

        var style = {
            transform: `translate(${xOffset}px, ${yOffset}px)`,
            transition: `transform ${OFFSET_TRANSITION_TIME / 2000}s ease`,
        };

        return (
            <g style={style}>
                {golds}
                {blues}
            </g>
        );
    },
});

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <div className="main">
          <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="main">
              <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`}>
                  <TwentySixteen />
              </g>
          </svg>
      </div>,
      document.getElementById('start')
    );
});
