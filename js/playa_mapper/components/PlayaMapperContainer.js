const React = require('react');
const PlayaMapperParameters = require('js/playa_mapper/parameters/PlayaMapperParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const PlayaMapperShapeView = require('js/playa_mapper/components/PlayaMapperShapeView');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const PlayaMapperContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        playaMapperParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            playaMapperParameters: this.state.playaMapperParameters,
        };
    },
    getInitialState: function() {
        return {
            playaMapperParameters: new PlayaMapperParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    getParameterBindings: function() {
        return {
            xOffset: this.state.playaMapperParameters.xOffset,
            yOffset: this.state.playaMapperParameters.yOffset,
        };
    },
    render: function() {
        const playaMapperParameters = this.state.playaMapperParameters;
        return (
            <BeatmathFrame>
                <g>
                    <circle cx={0} cy={0} r={10000} fill="#0044aa" />
                    {playaMapperParameters.mapShapes((shape, index) => {
                        return <PlayaMapperShapeView key={index} index={index} shape={shape} />;
                    })}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = PlayaMapperContainer;
