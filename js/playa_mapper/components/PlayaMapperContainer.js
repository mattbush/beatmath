const _ = require('lodash');
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
            rotateX: this.state.playaMapperParameters.rotateX,
            rotateY: this.state.playaMapperParameters.rotateY,
            scale: this.state.playaMapperParameters.scale,
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
            <BeatmathFrame>
                <g>
                    <circle cx={0} cy={0} r={10000} fill="#0044aa" />
                    {playaMapping.map((group, groupIndex) =>
                        <g key={groupIndex} style={{transform: this._serializeTransforms(group.transforms)}}>
                            {group.shapes.map((shape, index) => {
                                return <PlayaMapperShapeView key={index} index={index} shape={shape} />;
                            })}
                        </g>
                    )}
                </g>
            </BeatmathFrame>
        );
    },
});

module.exports = PlayaMapperContainer;
