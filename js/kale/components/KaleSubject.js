const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const KaleSubject = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        kaleParameters: React.PropTypes.object,
        subjectParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            tempo: this.context.beatmathParameters.tempo,
        };
    },
    render: function() {
        const subjectParameters = this.context.subjectParameters;
        const tempo = this.context.beatmathParameters.tempo;

        const outerScaleAmount = Math.pow(2, subjectParameters.outerScaleAmountLog2.getValue());
        const innerScaleAmount = Math.pow(2, subjectParameters.innerScaleAmountLog2.getValue());
        const driftX = subjectParameters.driftX.getValue();
        const driftY = subjectParameters.driftY.getValue();
        const outerRotation = subjectParameters.outerRotation.getValue();
        const innerRotation = subjectParameters.innerRotation.getValue();
        // const borderRadiusPercent = subjectParameters.borderRadiusPercent.getValue();

        const transform = {
            transform: `scale(${outerScaleAmount}) translate(${driftX}px, ${driftY}px) rotate(${outerRotation}deg) translate(0, 1px) scale(${innerScaleAmount}) rotate(${innerRotation}deg)`,
            transition: `transform ${tempo.getPeriod()}ms linear`,
            strokeWidth: 0.5,
        };

        return (
            <g style={transform}>
                <rect x={-1} y={-1} width={2} height={2} stroke="#fff" />
            </g>
        );
    },
});

module.exports = KaleSubject;
