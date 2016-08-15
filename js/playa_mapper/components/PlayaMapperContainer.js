const React = require('react');
const PlayaMapperParameters = require('js/playa_mapper/parameters/PlayaMapperParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const PlayaMapperShapeView = require('js/playa_mapper/components/PlayaMapperShapeView');
const PlayaMapperCurrentShapeView = require('js/playa_mapper/components/PlayaMapperCurrentShapeView');
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
            mapping: this.state.playaMapperParameters.mapping,
            currentShapeIndex: this.state.playaMapperParameters.currentShapeIndex,
        };
    },
    render: function() {
        const playaMapperParameters = this.state.playaMapperParameters;
        const currentShape = playaMapperParameters.getCurrentShape();
        return (
            <BeatmathFrame>
                <g>
                    <circle cx={0} cy={0} r={10000} fill="#0033dd" />
                    {playaMapperParameters.mapShapes((shape, index) => {
                        if (shape === currentShape) {
                            return null;
                        }
                        return <PlayaMapperShapeView key={index} shape={shape} />;
                    })}
                    {currentShape && <PlayaMapperCurrentShapeView shape={currentShape} />}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = PlayaMapperContainer;
