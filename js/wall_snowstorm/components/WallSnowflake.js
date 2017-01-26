const _ = require('lodash');
const React = require('react');
const {lerp, clamp} = require('js/core/utils/math');
const {SNOWFLAKE_SCALE, NUM_ROWS, NUM_COLUMNS} = require('js/wall_snowstorm/parameters/WallSnowstormConstants');
const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');

const hexGrid = require('js/wallow/WallowHexGrid');

const Y_AXIS_SCALE = Math.sqrt(3) / 2;

const Snowflake = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowflakeParameters: React.PropTypes.array,
        wallSnowstormParameters: React.PropTypes.object,
    },
    getInitialState() {
        return {mounted: false};
    },
    componentWillMount() {
        this._startTick = this.props.tick;
        this._blendedValues = {};
        for (const propertyName of ['length1', 'width1', 'offset2', 'length2', 'width2']) {
            this._blendedValues[propertyName] = lerp(
                this.context.snowflakeParameters[0][propertyName].getValue(),
                this.context.snowflakeParameters[1][propertyName].getValue(),
                this.props.blend,
            );
        }

        const baseColor = tinycolor.mix(
            this.context.snowflakeParameters[0].baseColor.getValue(),
            this.context.snowflakeParameters[1].baseColor.getValue(),
            this.props.blend * 100,
        );
        this._color = mapColorString(baseColor);

        //  const snowflakeParameters = this.context.snowflakeParameters;
        const points = [];
        const HYPOTENUSE = 2 * (3 ** -0.5);
        const TANGENT = 3 ** -0.5;
        const SINE = 1 / 2;
        const COSINE = 3 ** 0.5 / 2;
        const width1 = this.getBlendedValue('width1');
        const length1 = this.getBlendedValue('length1') + width1 * HYPOTENUSE;
        const offset2 = this.getBlendedValue('offset2') * this.getBlendedValue('length1');
        const width2 = this.getBlendedValue('width2');
        const length2 = this.getBlendedValue('length2') + width2 * HYPOTENUSE;
        const scale = SNOWFLAKE_SCALE * 300 / (5 + (1.5 * length1) + (3 * width1) + (1.5 * offset2) + (3 * width2) + (2 * length2));

        _.times(6, i => {
            const angle = Math.PI * i / 3;
            const cos0 = Math.cos(angle);
            const sin0 = Math.sin(angle);
            const addPoint = (x, y) => points.push([x * cos0 - y * sin0, y * cos0 + x * sin0]);

            // joint
            addPoint(width1, width1 * TANGENT + width1 * HYPOTENUSE);

            // left wing
            addPoint(width1, offset2 + width1 * TANGENT - width2 * HYPOTENUSE);
            addPoint(width1 + length2 * COSINE, offset2 + width1 * TANGENT + length2 * SINE - width2 * HYPOTENUSE);
            addPoint(width1 + length2 * COSINE, offset2 + width1 * TANGENT + length2 * SINE);
            addPoint(width1 + length2 * COSINE - width2, offset2 + width1 * TANGENT + length2 * SINE + width2 * TANGENT);
            addPoint(width1, offset2 + width1 * TANGENT + width2 * HYPOTENUSE);

            // apex
            addPoint(width1, length1 - width1 * TANGENT);
            addPoint(0, length1);
            addPoint(-width1, length1 - width1 * TANGENT);

            // right wing
            addPoint(-(width1), offset2 + width1 * TANGENT + width2 * HYPOTENUSE);
            addPoint(-(width1 + length2 * COSINE - width2), offset2 + width1 * TANGENT + length2 * SINE + width2 * TANGENT);
            addPoint(-(width1 + length2 * COSINE), offset2 + width1 * TANGENT + length2 * SINE);
            addPoint(-(width1 + length2 * COSINE), offset2 + width1 * TANGENT + length2 * SINE - width2 * HYPOTENUSE);
            addPoint(-(width1), offset2 + width1 * TANGENT - width2 * HYPOTENUSE);
        });

        this._scale = scale;
        this._points = points.map(p => p.join(',')).join(' ');
    },
    componentDidMount() {
        _.defer(() => {
            this.setState({mounted: true});
        });
    },
    getBlendedValue(propertyName) {
        return this._blendedValues[propertyName];
    },
    render: function() {
        const rowBase = (this.props.tick - this._startTick - 1); // ranges from -1 through NUM_ROWS
        // const totalTime = BEATS_PER_ROW * this.context.beatmathParameters.tempo.getPeriod();

        const row = clamp(rowBase, 0, NUM_ROWS - 1);
        const scale = (row === rowBase) ? this._scale : (this._scale / 100);
        const cell = hexGrid[row][this.props.column];

        const tx = this.props.column + (row % 2 ? 0.5 : 0) + cell.offsets[0];
        const ty = row * Y_AXIS_SCALE + cell.offsets[1];
        const rotation = (row % 2 ? 180 : 0);

        const delayPerColumn = this.context.wallSnowstormParameters.delayPerColumn.getValue();
        const delayPerRow = this.context.wallSnowstormParameters.delayPerRow.getValue();
        const transitionTime = this.context.wallSnowstormParameters.transitionTime.getValue();

        const rowDelay = (NUM_ROWS - rowBase) * delayPerRow;
        const columnDelay = delayPerColumn > 0 ? (this.props.column * delayPerColumn) : (NUM_COLUMNS - 1 - this.props.column) * Math.abs(delayPerColumn);
        const delay = rowDelay + columnDelay;

        const style = {
            transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: `transform ${transitionTime}ms ease-in ${delay}ms`,
        };

        return (
            <g style={style}>
                <polygon points={this._points} fill={this._color} />
            </g>
        );
    },
});

module.exports = Snowflake;
