const React = require('react');
const MapperParameters = require('js/mapper/parameters/MapperParameters');
const BeatmathFrame = require('js/core/components/BeatmathFrame');
const MapperShapeView = require('js/mapper/components/MapperShapeView');
const MapperCurrentShapeView = require('js/mapper/components/MapperCurrentShapeView');

const MapperContainer = React.createClass({
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
    render: function() {
        const mapperParameters = this.state.mapperParameters;
        const currentShape = mapperParameters.getCurrentShape();
        return (
            <BeatmathFrame>
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
