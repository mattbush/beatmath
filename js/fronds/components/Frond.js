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
            leafPointLength: this.props.frondState.leafPointLength,
        };
    },
    _renderFrondShape: function() {
        const leafLength = 100 * Math.pow(2, this.getParameterValue('leafLengthLog2'));
        const leafPointLength = leafLength * (1 + this.getParameterValue('leafPointLength'));
        const halfLeafWidth = 5;
        const halfLeafBaseWidth = halfLeafWidth * this.getParameterValue('leafTapering');
        const points = [`${halfLeafBaseWidth},0`, `${-halfLeafBaseWidth},0`, `${-halfLeafWidth},${leafLength}`, `0,${leafPointLength}`, `${halfLeafWidth},${leafLength}`].join(' ');

        return (
            <polygon fill={this.props.frondState.color.getValue().toHexString(true)} points={points} />
        );
    },
    _renderLeafAtIndex: function(leafIndex, frondShape) {
        const leafAngle = 360 * (leafIndex / this.getParameterValue('numLeaves'));
        const leafRotation = {
            opacity: this.context.frondsParameters.opacity.getValue(),
            transform: `rotate(${leafAngle}deg)`,
            transition: 'transform 2s',
        };

        return (
            <g key={leafIndex} style={leafRotation}>
                {frondShape}
            </g>
        );
    },
    render: function() {
        const frondState = this.props.frondState;

        const frondTranslation = {
            transform: `translate(${this.getParameterValue('x')}px,${this.getParameterValue('y')}px)`,
            transition: 'transform 0.25s linear',
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

        const frondShape = this._renderFrondShape();

        return (
            <g style={frondTranslation}>
                <g style={frondScale}>
                    <g style={frondRotation}>
                        {_.times(Math.round(this.getParameterValue('numLeaves')), i => this._renderLeafAtIndex(i, frondShape))}
                    </g>
                </g>
            </g>
        );
    },
});

module.exports = Frond;
