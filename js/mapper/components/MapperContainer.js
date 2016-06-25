const React = require('react');
const MapperParameters = require('js/mapper/parameters/MapperParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const MapperShapeView = require('js/mapper/components/MapperShapeView');
const MapperCurrentShapeView = require('js/mapper/components/MapperCurrentShapeView');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const MapperContainer = React.createClass({
    mixins: [ParameterBindingsMixin],
    childContextTypes: {
        mapperParameters: React.PropTypes.object,
    },
    contextTypes: {
        mixboard: React.PropTypes.object,
        beatmathParameters: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            mapperParameters: this.state.mapperParameters,
        };
    },
    getInitialState: function() {
        return {
            mapperParameters: new MapperParameters(this.context.mixboard, this.context.beatmathParameters),
        };
    },
    getParameterBindings: function() {
        return {
            mapping: this.state.mapperParameters.mapping,
            currentShapeIndex: this.state.mapperParameters.currentShapeIndex,
        };
    },
    render: function() {
        const mapperParameters = this.state.mapperParameters;
        const currentShape = mapperParameters.getCurrentShape();
        return (
            <BeatmathFrame>
                <circle cx={0} cy={0} r={10000} fill="#0033dd" />
                {mapperParameters.mapShapes((shape, index) => {
                    if (shape === currentShape) {
                        return null;
                    }
                    return <MapperShapeView key={index} shape={shape} />;
                })}
                {currentShape && <MapperCurrentShapeView shape={currentShape} />}
            </BeatmathFrame>
        );
    },
});

module.exports = MapperContainer;
