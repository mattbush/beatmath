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
            tempo: this.context.beatmathParameters.tempo,
            x: this.props.frondState.x,
            y: this.props.frondState.y,
            numLeaves: this.props.frondState.numLeaves,
            leafLengthLog2: this.props.frondState.leafLengthLog2,
            leafTapering: this.props.frondState.leafTapering,
        };
    },
    _renderLeafAtIndex: function(leafIndex) {
        const leafAngle = 360 * (leafIndex / this.getParameterValue('numLeaves'));
        const leafRotation = {
            opacity: 1.0,
            transform: `rotate(${leafAngle}deg)`,
            transition: `transform 2s`,
        };
        const leafLength = 100 * Math.pow(2, this.getParameterValue('leafLengthLog2'));
        const halfLeafWidth = 5;
        const halfLeafBaseWidth = halfLeafWidth * this.getParameterValue('leafTapering');
        const points = [`${halfLeafBaseWidth},0`, `${-halfLeafBaseWidth},0`, `${-halfLeafWidth},${leafLength}`, `${halfLeafWidth},${leafLength}`].join(' ');

        return (
            <g key={leafIndex} style={leafRotation}>
                <polygon fill={this.props.frondState.color.getValue().toHexString(true)} points={points} />
            </g>
        );
    },
    render: function() {
        const frondState = this.props.frondState;

        const frondTranslation = {
            transform: `translate(${this.getParameterValue('x')}px,${this.getParameterValue('y')}px)`,
            transition: `transform 0.25s linear`,
        };

        const scale = Math.pow(2, frondState.scaleLog2.getValue());
        const scaleTransition = frondState.getScaleTransitionTime();
        const frondScale = {
            transform: `scale(${scale})`,
            transition: `transform ${scaleTransition / 1000}s ease-in-out`,
        };

        const angle = frondState.angle.getValue();
        const angleTransition = frondState.getAngleTransitionTime();
        const frondRotation = {
            transform: `rotate(${angle}deg)`,
            transition: `transform ${angleTransition / 1000}s ease-in-out`,
        };

        return (
            <g style={frondTranslation}>
                <g style={frondScale}>
                    <g style={frondRotation}>
                        {_.times(this.getParameterValue('numLeaves'), this._renderLeafAtIndex)}
                    </g>
                </g>
            </g>
        );
    },
});

module.exports = Frond;
