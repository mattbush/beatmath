const _ = require('lodash');
const React = require('react');
const mapColorString = require('js/core/utils/mapColorString');
const {lerp} = require('js/core/utils/math');

function generateSnowflakePoints({width1, length1, width2, length2, offset2}) {
    const points = [];
    const HYPOTENUSE = 2 * (3 ** -0.5);
    const TANGENT = 3 ** -0.5;
    const SINE = 1 / 2;
    const COSINE = 3 ** 0.5 / 2;
    width1 = lerp(0.1, 0.45, width1 / 16);
    width2 = lerp(0.1, 0.45, width2 / 16);
    length1 = lerp(0.3, 1.5, length1 / 16) + width1 * HYPOTENUSE;
    length2 = lerp(0.3, 1.5, length2 / 16) + width2 * HYPOTENUSE;
    offset2 = offset2 / 16 * length1;
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

    return points.map(p => p.map(x => x * scale).join(',')).join(' ');
}

const GENERATED_SNOWFLAKE_POINTS = _.times(9, length1 => {
    return _.times(9, length2 => {
        return _.times(9, width1 => {
            return _.times(9, width2 => {
                return _.times(9, offset2 => {
                    return generateSnowflakePoints({length1, length2, width1, width2, offset2});
                });
            });
        });
    });
});

const SnowgridInnerPixel = React.createClass({
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    render: function() {
        const {length1, length2, width1, width2, offset2} = this.props;

        let color = this.props.color;
        const fill = mapColorString(color.toHexString(true));

        const points = GENERATED_SNOWFLAKE_POINTS[length1][length2][width1][width2][offset2];

        return (
            <polygon points={points} fill={fill} />
        );
    },
});

module.exports = SnowgridInnerPixel;
