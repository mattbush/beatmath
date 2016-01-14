var React = require('react');
var BrickTriangle = require('js/components/bricks/BrickTriangle');
var BrickGridState = require('js/state/bricks/BrickGridState');
var BeatmathFrame = require('js/components/BeatmathFrame');
var BricksParameters = require('js/parameters/bricks/BricksParameters');

const {BRICK_SCALE, POSITION_REFRESH_RATE, TRIANGLE_GENERATING_RATE} = require('js/parameters/bricks/BricksConstants');

const POSITION_OFFSET_REFRESH_RATE = Math.max(TRIANGLE_GENERATING_RATE, POSITION_REFRESH_RATE);

var BrickGrid = React.createClass({
    childContextTypes: {
        bricksParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            bricksParameters: this.state.bricksParameters,
        };
    },
    getInitialState: function() {
        return {
            bricksParameters: new BricksParameters(this.context.mixboard),
            gridState: new BrickGridState(this.context.mixboard),
        };
    },
    componentDidMount: function() {
        setInterval(this._update, TRIANGLE_GENERATING_RATE);
    },
    _update: function() {
        this.state.gridState.update();
        this.forceUpdate();
    },
    render: function() {
        var grid = this.state.gridState.getGrid();
        var brickPosition = this.state.gridState.getBrickPosition();
        var triangles = [];
        this._coordsToDelete = [];
        for (let coords in grid) {
            var [x, y] = coords.split(',').map(Number);
            triangles.push(<BrickTriangle key={coords} x={x} y={y} orientation={grid[coords]} />);
        }

        var style = {
            transform: `scale(${BRICK_SCALE}) translate(${-brickPosition.getX()}px, ${-brickPosition.getY()}px)`,
            transition: `transform ${POSITION_OFFSET_REFRESH_RATE / 1000}s linear`,
        };

        return (
            <BeatmathFrame>
                <g style={style}>
                    {triangles}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = BrickGrid;
