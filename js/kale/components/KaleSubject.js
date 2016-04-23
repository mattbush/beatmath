const React = require('react');

const KaleSubject = React.createClass({
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        kaleParameters: React.PropTypes.object,
        subjectParameters: React.PropTypes.object,
    },
    render: function() {
        const subjectParameters = this.context.subjectParameters;
        const tempo = this.context.beatmathParameters.tempo;

        const outerScaleAmount = Math.pow(2, subjectParameters.outerScaleAmountLog2.getValue());
        const innerScaleAmount = Math.pow(2, subjectParameters.innerScaleAmountLog2.getValue());
        const driftX = subjectParameters.driftX.getValue();
        const driftY = subjectParameters.driftY.getValue();
        const outerRotateDeg = subjectParameters.outerRotation.getValue();
        const innerRotateDeg = subjectParameters.innerRotation.getValue();

        const transform = {
            transform: `scale(${outerScaleAmount}) translate(${driftX}px, ${driftY}px) rotate(${outerRotateDeg}deg) translate(0, 10px) scale(${innerScaleAmount}) rotate(${innerRotateDeg}deg)`,
            transition: `transform ${tempo.getPeriod()}ms linear`,
        };

        return (
            <g style={transform}>
                <rect />
            </g>
        );
    },
});

module.exports = KaleSubject;
