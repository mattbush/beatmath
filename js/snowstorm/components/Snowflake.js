const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const {lerp} = require('js/core/utils/math');

const Snowflake = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowstormParameters: React.PropTypes.array,
    },
    getParameterBindings: function() {
        const parametersAtSnowstormIndex = i => ({
            [i + 'length1']: this.context.snowstormParameters[i].length1,
            [i + 'width1']: this.context.snowstormParameters[i].width1,
            [i + 'offset2']: this.context.snowstormParameters[i].offset2,
            [i + 'length2']: this.context.snowstormParameters[i].length2,
            [i + 'width2']: this.context.snowstormParameters[i].width2,
        });
        return {
            ...parametersAtSnowstormIndex(0),
            ...parametersAtSnowstormIndex(1),
        };
    },
    getBlendedValue(name) {
        return lerp(this.getParameterValue(0 + name), this.getParameterValue(1 + name), this.props.blend);
    },
    render: function() {
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
        const scale = 300 / (5 + (1.5 * length1) + (3 * width1) + (1.5 * offset2) + (3 * width2) + (2 * length2));

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

        const dx = (-0.5 + this.props.blend) * 1000;
        console.log(this.props.blend, dx);

        return (
            <g style={{transform: `translateX(${dx}px) scale(${scale})`}}>
                <polygon points={points.map(p => p.join(',')).join(' ')} fill="#0ff" />
            </g>
        );
    },
});

module.exports = Snowflake;
