const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
// const {lerp, clamp} = require('js/core/utils/math');

const Snowflake = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
        snowstormParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            length1: this.context.snowstormParameters.length1,
            width1: this.context.snowstormParameters.width1,
        };
    },
    render: function() {
        //  const snowstormParameters = this.context.snowstormParameters;
        const points = [];
        const HYPOTENUSE = 2 * (3 ** -0.5);
        const TANGENT = 3 ** -0.5;
        const length1 = this.getParameterValue('length1');
        const width1 = this.getParameterValue('width1');

        _.times(6, i => {
            const angle = Math.PI * i / 3;
            const cos0 = Math.cos(angle);
            const sin0 = Math.sin(angle);
            const addPoint = (x, y) => points.push([x * cos0 - y * sin0, y * cos0 + x * sin0]);

            addPoint(width1, width1 * TANGENT + width1 * HYPOTENUSE);
            addPoint(width1, length1 + width1 * TANGENT);
            addPoint(0, length1 + width1 * HYPOTENUSE);
            addPoint(-width1, length1 + width1 * TANGENT);
        });

        return (
            <g style={{transform: 'scale(200)'}}>
                <polygon points={points.map(p => p.join(',')).join(' ')} fill="#0ff" />
            </g>
        );
    },
});

module.exports = Snowflake;
