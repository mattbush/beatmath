const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const KaleSubject = require('js/kale/components/KaleSubject');

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

        return (
            <g>
                <g>
                    <g clipPath={clipPath}><KaleSubject /></g>
                </g>
                <g transform="scale(-1, 1)">
                    <g clipPath={clipPath}><KaleSubject /></g>
                </g>
                {isSixCelled && [
                    <g key="2" transform="rotate(120)">
                        <g clipPath={clipPath}><KaleSubject /></g>
                    </g>,
                    <g key="3" transform="rotate(120) scale(-1, 1)">
                        <g clipPath={clipPath}><KaleSubject /></g>
                    </g>,
                    <g key="4" transform="rotate(240)">
                        <g clipPath={clipPath}><KaleSubject /></g>
                    </g>,
                    <g key="5" transform="rotate(240) scale(-1, 1)">
                        <g clipPath={clipPath}><KaleSubject /></g>
                    </g>,
                ]}
            </g>
        );
    },
});

module.exports = KaleCell;
