require('regenerator/runtime');
const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const BeatmathFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            width: this.context.beatmathParameters.width,
            height: this.context.beatmathParameters.height,
            frameRotation: this.context.beatmathParameters.frameRotation,
            frameScale: this.context.beatmathParameters.frameScale,
            frameScaleAutoupdating: this.context.beatmathParameters.frameScaleAutoupdating,
            mappingMode: this.context.beatmathParameters.mappingMode,
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
    _renderDefs(groupNumber) {
        const mappingMode = this.getParameterValue('mappingMode');
        if (mappingMode === 'oneFramePerGroup') {
            return (
                <defs>
                    {this.props.defs}
                    <clipPath id={`group${groupNumber}AllShapes`}>
                        {this.context.beatmathParameters.mapMapperShapesInGroup(groupNumber, (mapperShape, index) => {
                            const pointsArray = mapperShape.map(vertex => {
                                return `${vertex[0]},${vertex[1]}`;
                            });
                            const pointsString = pointsArray.join(' ');
                            return <polygon key={index} points={pointsString} />;
                        })}
                    </clipPath>
                    {this.context.beatmathParameters.mapMapperShapesInGroup(groupNumber, (mapperShape, index) => {
                        const pointsArray = mapperShape.map(vertex => {
                            return `${vertex[0]},${vertex[1]}`;
                        });
                        const pointsString = pointsArray.join(' ');
                        return (
                            <clipPath key={'mapperShape' + index} id={`group${groupNumber}mapperShape` + index}>
                                <polygon points={pointsString} />
                            </clipPath>
                        );
                    })}
                </defs>
            );
        } else {
            return (
                <defs>
                    {this.props.defs}
                    <clipPath id={'allMapperShapes'}>
                        {this.context.beatmathParameters.mapMapperShapes((mapperShape, index) =>
                            <polygon key={index} points={mapperShape.getPointsString()} />
                        )}
                    </clipPath>
                    {this.context.beatmathParameters.mapMapperShapes((mapperShape, index) =>
                        <clipPath key={'mapperShape' + index} id={'mapperShape' + index}>
                            <polygon points={mapperShape.getPointsString()} />
                        </clipPath>
                    )}
                </defs>
            );
        }
    },
    _renderChildFrames(groupNumber, scaleMod = 1) {
        const frameRotation = this.getParameterValue('frameRotation');
        const frameScale = scaleMod * this.getParameterValue('frameScale') * this.getParameterValue('frameScaleAutoupdating');
        const transitionPeriod = this.context.beatmathParameters.tempo.getBasePeriod() / 16;
        const style = {
            transform: `rotate(${frameRotation}deg) scale(${frameScale})`,
            transition: `transform ${transitionPeriod}ms linear`,
        };

        const mappingMode = this.getParameterValue('mappingMode');
        if (mappingMode === 'onWithFramesSpecial') {
            return this.context.beatmathParameters.mapMapperShapes((mapperShape, index) => {
                const clonedChild = React.cloneElement(React.Children.only(this.props.children), {
                    mapperShape: mapperShape,
                    mapperShapeIndex: index,
                });

                const translatedStyle = {
                    ...style,
                    transform: `translate(${mapperShape.getCenterX()}px, ${mapperShape.getCenterY()}px) ` + style.transform,
                };

                return (
                    <g key={index} clipPath={`url(#mapperShape${index})`}>
                        <g style={translatedStyle}>
                            {clonedChild}
                        </g>
                    </g>
                );
            });
        } else if (mappingMode === 'onWithFrames') {
            return this.context.beatmathParameters.mapMapperShapes((mapperShape, index) => {
                const clonedChild = React.cloneElement(React.Children.only(this.props.children), {

                });

                const translatedStyle = {
                    ...style,
                    transform: `translate(${mapperShape.getCenterX()}px, ${mapperShape.getCenterY()}px) ` + style.transform,
                };

                return (
                    <g key={index} clipPath={`url(#mapperShape${index})`}>
                        <g style={translatedStyle}>
                            {clonedChild}
                        </g>
                    </g>
                );
            });

        } else if (mappingMode === 'onWithOneFrame') {
            return (
                <g clipPath={'url(#allMapperShapes)'}>
                    <g style={style}>
                        {this.props.children}
                    </g>
                </g>
            );
        } else if (mappingMode === 'oneFramePerGroup') {
            return (
                <g clipPath={`url(#group${groupNumber}AllShapes)`}>
                    <g style={style}>
                        {this.props.children}
                    </g>
                </g>
            );
        } else { // off
            return (
                <g style={style}>
                    {this.props.children}
                </g>
            );
        }
    },
    render: function() {
        // From KaleCell
        // const clipPath = `url(#${clipPathPrefixFull}~${triGridPercent})`;
        //
        // return (
        //     <g key={index} transform={`${scale}rotate(${rotationDeg})`}>
        //         <g clipPath={clipPath}>
        //             <KaleSubject cellX={x} cellY={y} />
        //         </g>
        //     </g>
        // );

        const mappingMode = this.getParameterValue('mappingMode');
        if (mappingMode === 'oneFramePerGroup') {
            const mapperGroups = this.context.beatmathParameters.mapPlayaMapperGroups((group, groupIndex) => {
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
                            {this._renderDefs(groupIndex)}
                            {this._renderChildFrames(groupIndex, 1 / group.scaleFactor)}
                        </g>
                    </svg>
                );
            });
            return (
                <div style={{transform: `translate(${this.getParameterValue('width') / 2}px, ${this.getParameterValue('height') * this.context.beatmathParameters.getPlayaMapperProjectionOffset()}px)`}}>
                    {mapperGroups}
                </div>
            );
        } else {
            const width = this.getParameterValue('width');
            const height = this.getParameterValue('height');
            const style = {
                transform: `translate(${width / 2}px, ${height / 2}px)`,
            };
            return (
                <div className="main">
                    <svg width={width} height={height}>
                        <g style={style}>
                            {this._renderDefs()}
                            {this._renderChildFrames()}
                        </g>
                    </svg>
                </div>
            );
        }
    },
});

module.exports = BeatmathFrame;
