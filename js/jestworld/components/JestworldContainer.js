const React = require('react');
const JestworldParameters = require('js/jestworld/parameters/JestworldParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const JestworldGrid = require('js/jestworld/components/JestworldGrid');

const JestworldContainer = React.createClass({
    childContextTypes: {
        jestworldParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            jestworldParameters: this.state.jestworldParameters,
        };
    },
    getInitialState: function() {
        return {
            jestworldParameters: new JestworldParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <JestworldGrid />
            </BeatmathFrame>
        );
    },
});

module.exports = JestworldContainer;
