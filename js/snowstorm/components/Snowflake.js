const _ = require('lodash');
const React = require('react');
const {lerp} = require('js/core/utils/math');
const {NUM_ROWS, NUM_COLUMNS, BEATS_PER_ROW, SNOWFLAKE_SCALE} = require('js/snowstorm/parameters/SnowstormConstants');
const tinycolor = require('tinycolor2');
const mapColorString = require('js/core/utils/mapColorString');

const Snowflake = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowstormParameters: React.PropTypes.array,
    },
    getInitialState() {
        return {mounted: false};
    },
    componentWillMount() {
        this._blendedValues = {};
        for (const propertyName of ['length1', 'width1', 'offset2', 'length2', 'width2', 'rotation']) {
            this._blendedValues[propertyName] = lerp(
                this.context.snowstormParameters[0][propertyName].getValue(),
                this.context.snowstormParameters[1][propertyName].getValue(),
                this.props.blend,
            );
        }

        const baseColor = tinycolor.mix(
            this.context.snowstormParameters[0].baseColor.getValue(),
            this.context.snowstormParameters[1].baseColor.getValue(),
            this.props.blend * 100,
        );
        this._color = mapColorString(baseColor);

        //  const snowstormParameters = this.context.snowstormParameters;
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
        const dx = (-0.5 + this.props.blend) * 116 * (NUM_COLUMNS + 1.5);
        const dy = this.state.mounted ? 116 * (NUM_ROWS + 1) : 0;
        const rotation = this.state.mounted ? this.getBlendedValue('rotation') * NUM_ROWS : 0;

        const delay = (NUM_ROWS + 1) * BEATS_PER_ROW * this.context.beatmathParameters.tempo.getPeriod();
        const style = {
            transform: `translate(${dx}px, ${dy}px) scale(${this._scale}) rotate(${rotation}deg)`,
            transition: `transform ${delay}ms linear`,
        };

//        console.log(style);

        return (
            <g style={style}>
                <polygon points={this._points} fill={this._color} />
            </g>
        );
    },
});

module.exports = Snowflake;
