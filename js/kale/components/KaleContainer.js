const React = require('react');
const KaleParameters = require('js/kale/parameters/KaleParameters');
const SubjectParameters = require('js/kale/parameters/SubjectParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const KaleGrid = require('js/kale/components/KaleGrid');
const KaleClipPaths = require('js/kale/components/KaleClipPaths');

const KaleContainer = React.createClass({
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
    render: function() {
        return (
            <BeatmathFrame defs={KaleClipPaths}>
                <KaleGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = KaleContainer;
