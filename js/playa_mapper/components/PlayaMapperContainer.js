const _ = require('lodash');
const React = require('react');
const PlayaMapperParameters = require('js/playa_mapper/parameters/PlayaMapperParameters');
// const BeatmathFrame = require('js/core/components/BeatmathFrame');
const PlayaMapperShapeView = require('js/playa_mapper/components/PlayaMapperShapeView');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');
const {WIDTH_PX, HEIGHT_PX} = require('js/core/parameters/BeatmathConstants.js');

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
            triangleYawAngle: this.state.playaMapperParameters.triangleYawAngle,
            trianglePitchAngle: this.state.playaMapperParameters.trianglePitchAngle,
            scale: this.state.playaMapperParameters.scale,
            projectorPitchAngle: this.state.playaMapperParameters.projectorPitchAngle,
            projectorOffset: this.state.playaMapperParameters.projectorOffset,
        };
    },
    _serializeTransforms(transforms) {
        let result = '';
        transforms.forEach(transform => {
            _.each(transform, (value, type) => {
                const valueString = _.isArray(value) ? value.join('px,') + 'px' : value;
                result += `${type}(${valueString}${type.startsWith('rotate') ? 'deg' : ''}) `;
            });
        });
        return result;
    },
    render: function() {
        const playaMapperParameters = this.state.playaMapperParameters;
        const playaMapping = playaMapperParameters.getPlayaMapping();
        return (
            <div style={{backgroundColor: '#0044aa', width: WIDTH_PX, height: HEIGHT_PX}}>
                <div style={{transform: `translate(${WIDTH_PX / 2}px, ${HEIGHT_PX * playaMapping.projectorOffset}px)`}}>
                    {playaMapping.groups.map((group, groupIndex) => {
                        const width = group.width * group.scaleFactor;
                        const height = group.height * group.scaleFactor;
                        const style = {
                            // backgroundColor: '#4400aa',
                            top: -height / 2,
                            left: -width / 2,
                            transform: this._serializeTransforms(group.transforms),
                            position: 'absolute',
                        };
                        return (
                            <svg key={groupIndex} style={style} width={width} height={height}>
                                <g style={{transform: `scale(${group.scaleFactor}) translate(${group.width / 2}px, ${group.height / 2}px)`}}>
                                    {group.shapes.map((shape, index) => {
                                        return <PlayaMapperShapeView key={index} index={index} shape={shape} />;
                                    })}
                                </g>
                            </svg>
                        );
                    })}
                </div>
            </div>
        );
    },
});

module.exports = PlayaMapperContainer;
