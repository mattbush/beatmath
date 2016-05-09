const _ = require('underscore');
const React = require('react');
const KaleParameters = require('js/kale/parameters/KaleParameters');
const SubjectParameters = require('js/kale/parameters/SubjectParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const KaleCell = require('js/kale/components/KaleCell');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const SQRT_3 = Math.pow(3, 0.5);
const CLIP_PATHS = _.map([
    <clipPath id="halfInfinite" key="0">
        <rect x="0" y="-1000" width="1000" height="2000" />
    </clipPath>,
    <clipPath id="sixthInfinite" key="0">
        <polygon points={`0,0 1000,${1000 / SQRT_3} 1000,-${1000 / SQRT_3}`} />
    </clipPath>,
    <clipPath id="halfCell" key="0">
    <polygon points={`0,0 0,${2 / SQRT_3} 1,${1 / SQRT_3} 1,-${1 / SQRT_3} 0,-${2 / SQRT_3}`} />
    </clipPath>,
    <clipPath id="sixthCell" key="0">
        <polygon points={`0,0 1,${1 / SQRT_3} 1,-${1 / SQRT_3}`} />
    </clipPath>,
], (clipPath, i) => React.cloneElement(clipPath, {key: i}));

const KaleContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        kaleParameters: React.PropTypes.object,
        subjectParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            kaleParameters: this.state.kaleParameters,
            subjectParameters: this.state.subjectParameters,
        };
    },
    getInitialState: function() {
        return {
            kaleParameters: new KaleParameters(this.context.mixboard, this.context.beatmathParameters),
            subjectParameters: new SubjectParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    getParameterBindings: function() {
        return {
            numRows: this.state.kaleParameters.numRows,
            numCols: this.state.kaleParameters.numCols,
            isInfinite: this.state.kaleParameters.isInfinite,
        };
    },
    render: function() {
        let kaleCells;
        if (this.getParameterValue('isInfinite')) {
            kaleCells = <KaleCell logicalX={0} logicalY={0} />;
        } else {
            kaleCells = [];
            const numRows = this.getParameterValue('numRows');
            const numCols = this.getParameterValue('numCols');
            for (let y = -numRows; y <= numRows; y++) {
                for (let x = -numCols; x <= numCols; x++) {
                    if ((x + y) % 2 !== 0) {
                        continue;
                    }
                    kaleCells.push(
                        <KaleCell key={`${x}~${y}`} logicalX={x} logicalY={y} />
                    );
                }
            }
        }

        return (
            <BeatmathFrame defs={CLIP_PATHS}>
                <g transform="scale(64)">
                    {kaleCells}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = KaleContainer;