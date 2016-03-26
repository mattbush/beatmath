const _ = require('underscore');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const Frond = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        frondsParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            numLeaves: this.props.frondState.numLeaves,
        };
    },
    _renderLeafAtIndex: function(leafIndex) {
        const leafAngle = 360 * (leafIndex / this.getParameterValue('numLeaves'));
        const leafRotation = {
            transform: `rotate(${leafAngle}deg)`,
            transition: `transform 2s`,
        };
        return (
            <g key={leafIndex} style={leafRotation}>
                <rect fill="#fff" y={0} x={-5} width={10} height={100} />
            </g>
        );
    },
    render: function() {
        const frondState = this.props.frondState;

        const scale = Math.pow(2, frondState.scaleLog2.getValue());
        const scaleTransition = frondState.getScaleTransitionTime();
        const frondScale = {
            transform: `scale(${scale})`,
            transition: `transform ${scaleTransition}s`,
        };

        const angle = Math.pow(2, frondState.angle.getValue());
        const angleTransition = frondState.getAngleTransitionTime();
        const frondRotation = {
            transform: `rotate(${angle}deg)`,
            transition: `transform ${angleTransition}s`,
        };

        return (
            <g style={frondScale}>
                <g style={frondRotation}>
                    {_.times(this.getParameterValue('numLeaves'), this._renderLeafAtIndex)}
                </g>
            </g>
        );
    },
});

module.exports = Frond;