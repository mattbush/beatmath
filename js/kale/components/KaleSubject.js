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
        const borderRadiusPercent = 5 * subjectParameters.borderRadiusPercent.getValue();

        const transform = {
            transform: `scale(${outerScaleAmount}) translate(${driftX}px, ${driftY}px) rotate(${outerRotation}deg) translate(0, 4px) scale(${innerScaleAmount}) rotate(${innerRotation}deg)`,
            transition: `transform ${tempo.getPeriod()}ms linear`,
            strokeWidth: 2.5,
        };

        return (
            <g style={transform}>
                <rect x={-5} y={-5} width={10} height={10} rx={borderRadiusPercent} ry={borderRadiusPercent} stroke="#fff" />
            </g>
        );
    },
});

module.exports = KaleSubject;
