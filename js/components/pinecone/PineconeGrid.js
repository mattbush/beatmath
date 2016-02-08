// var _ = require('underscore');
var React = require('react');
var BeatmathFrame = require('js/components/BeatmathFrame');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');
var PineconeParameters = require('js/parameters/pinecone/PineconeParameters');

var PineconeGrid = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        pineconeParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            pineconeParameters: this.state.pineconeParameters,
        };
    },
    getInitialState: function() {
        var mixboard = this.context.mixboard;
        var pineconeParameters = new PineconeParameters(mixboard);
        return {pineconeParameters};
    },
    getParameterBindings: function() {
        return {
//            foo: this.state.pineconeParameters.foo,
        };
    },
    render: function() {
        return (
            <BeatmathFrame>
                <g>
                    Hello world!
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = PineconeGrid;
