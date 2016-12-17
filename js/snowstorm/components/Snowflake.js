// const _ = require('lodash');
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
//          foo: this.state.snowstormParameters.foo,
        };
    },
    render: function() {
        // const snowstormParameters = this.context.snowstormParameters;

        return (
            <g style={{transform: 'scale(200)'}}>
                <polygon points="1,1 0,0 1,-1" fill="#0ff" />
            </g>
        );
    },
});

module.exports = Snowflake;
