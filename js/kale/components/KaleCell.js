const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const KaleSubject = require('js/kale/components/KaleSubject');

const Y_AXIS_SCALE = Math.sqrt(3);

const KaleCell = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
        kaleParameters: React.PropTypes.object,
        subjectParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            // tempo: this.context.beatmathParameters.tempo,
            isInfinite: this.context.kaleParameters.isInfinite,
            isSixCelled: this.context.kaleParameters.isSixCelled,
        };
    },
    render: function() {
        const isInfinite = this.getParameterValue('isInfinite');
        const isSixCelled = this.getParameterValue('isSixCelled');
        const clipPathName = isInfinite ?
            (isSixCelled ? 'sixthInfinite' : 'halfInfinite') :
            (isSixCelled ? 'sixthCell' : 'halfCell');
        const clipPath = `url(#${clipPathName})`;

        const x = this.props.logicalX;
        const y = this.props.logicalY * Y_AXIS_SCALE;
        const subject = (
            <g clipPath={clipPath}>
                <KaleSubject cellX={x} cellY={y} />
            </g>
        );

        return (
            <g transform={`translate(${x}, ${y})`}>
                <g>
                    {subject}
                </g>
                <g transform="scale(-1, 1)">
                    {subject}
                </g>
                {isSixCelled && [
                    <g key="2" transform="rotate(120)">
                        {subject}
                    </g>,
                    <g key="3" transform="rotate(120) scale(-1, 1)">
                        {subject}
                    </g>,
                    <g key="4" transform="rotate(240)">
                        {subject}
                    </g>,
                    <g key="5" transform="rotate(240) scale(-1, 1)">
                        {subject}
                    </g>,
                ]}
            </g>
        );
    },
});

module.exports = KaleCell;
