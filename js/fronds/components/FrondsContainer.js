const _ = require('lodash');
const React = require('react');
const FrondsParameters = require('js/fronds/parameters/FrondsParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const Frond = require('js/fronds/components/Frond');

const FrondsContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        frondsParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            frondsParameters: this.state.frondsParameters,
        };
    },
    getInitialState: function() {
        return {
            frondsParameters: new FrondsParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    getParameterBindings: function() {
        return {
            numFronds: this.state.frondsParameters.numFronds,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                {_.times(this.getParameterValue('numFronds'), frondIndex =>
                    <Frond key={frondIndex} frondState={this.state.frondsParameters.frondStates[frondIndex]} />
                )}
                Hello world!
            </BeatmathFrame>
        );
    },
});

module.exports = FrondsContainer;
