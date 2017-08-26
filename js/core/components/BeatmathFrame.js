require('regenerator/runtime');
const _ = require('lodash');
const React = require('react');
const ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

const BeatmathFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    getParameterBindings() {
        return {
            width: this.context.beatmathParameters.width,
            height: this.context.beatmathParameters.height,
            frameRotation: this.context.beatmathParameters.frameRotation,
            frameScale: this.context.beatmathParameters.frameScale,
            frameScaleAutoupdating: this.context.beatmathParameters.frameScaleAutoupdating,
            mappingMode: this.context.beatmathParameters.mappingMode,
            towerScale: this.context.beatmathParameters.towerScale,
            canopyOrTower: this.context.beatmathParameters.canopyOrTower,
            mirrorCanopies: this.context.beatmathParameters.mirrorCanopies,
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
        if (mappingMode === 'oneFramePerGroup' || mappingMode === 'acrossGroups' || mappingMode === 'inFramesInGroups') {
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
                            <clipPath key={'mapperShape' + index} id={`group${groupNumber}Shape` + index}>
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
    _renderMasks() {
        if (location.href.endsWith('mapper')) {
            return null;
        }

        return this.context.beatmathParameters.mapMapperMasks((mapperShape, index) =>
            <polygon fill="#000" key={index} points={mapperShape.getPointsString()} />
        );
    },
    _renderChildFrames(groupNumber, scaleMod = 1, translateY = 0, groupType) {
        const frameRotation = this.getParameterValue('frameRotation');

        let frameScale = scaleMod * this.context.beatmathParameters.getFrameScale();
        if (groupType === 'tower') {
            frameScale *= this.getParameterValue('towerScale');
        }
        const transitionPeriod = this.context.beatmathParameters.tempo.getPeriod();
        const style = {
            transform: `scale(${frameScale})`,
            transition: `transform ${transitionPeriod}ms linear`,
        };
        const rotatedStyle = {
            ...style,
            transform: `rotate(${frameRotation}deg) ` + style.transform,
        };

        const mappingMode = this.getParameterValue('mappingMode');
        if (mappingMode === 'onWithFramesSpecial') {
            return this.context.beatmathParameters.mapMapperShapes((mapperShape, index) => {
                const clonedChild = React.cloneElement(React.Children.only(this.props.children), {
                    mapperShape: mapperShape,
                    mapperShapeIndex: index,
                    groupType: groupType,
                });

                const combinedRotation = mapperShape.getRotationDeg() + frameRotation;

                const translatedStyle = {
                    ...style,
                    transform: `translate(${mapperShape.getCenterX()}px, ${mapperShape.getCenterY()}px) rotate(${combinedRotation}deg) ` + style.transform,
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

                const combinedRotation = mapperShape.getRotationDeg() + frameRotation;

                const translatedStyle = {
                    ...style,
                    transform: `translate(${mapperShape.getCenterX()}px, ${mapperShape.getCenterY()}px) rotate(${combinedRotation}deg) ` + style.transform,
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
                    <g style={rotatedStyle}>
                        {this.props.children}
                    </g>
                </g>
            );
        } else if (mappingMode === 'inFramesInGroups') {
            const canopyOrTower = this.getParameterValue('canopyOrTower');
            const shouldShow = (canopyOrTower === 'both' || canopyOrTower === groupType);

            return this.context.beatmathParameters.mapMapperShapesInGroup(groupNumber, (mapperShape, index) => {
                const clonedChild = React.cloneElement(React.Children.only(this.props.children), {
                    mapperShapeIndex: groupNumber * 4 + index,
                    groupType: groupType,
                });

                const centerX = (mapperShape[0][0] + mapperShape[1][0] + mapperShape[2][0]) / 3;
                const centerY = (mapperShape[0][1] + mapperShape[1][1] + mapperShape[2][1]) / 3;

                const translatedStyle = {
                    ...style,
                    transform: `translate(${centerX}px, ${centerY}px) ` + style.transform,
                };

                return (
                    <g key={index} clipPath={`url(#group${groupNumber}Shape${index})`}>
                        <g style={translatedStyle}>
                            {shouldShow && clonedChild}
                        </g>
                    </g>
                );
            });
        } else if (mappingMode === 'oneFramePerGroup' || mappingMode === 'acrossGroups') {
            const clonedChild = React.cloneElement(React.Children.only(this.props.children), {
                groupType: groupType,
                mapperShapeIndex: (mappingMode === 'acrossGroups' ? groupNumber : null),
            });

            const canopyOrTower = this.getParameterValue('canopyOrTower');
            const shouldShow = (canopyOrTower === 'both' || canopyOrTower === groupType);

            const translatedStyle = {
                ...style,
                transform: `translate(0px, ${translateY}px) ` + style.transform,
            };

            if (this.getParameterValue('mirrorCanopies') && groupNumber) {
                translatedStyle.transform = 'scaleX(-1) ' + translatedStyle.transform;
            }

            return (
                <g clipPath={`url(#group${groupNumber}AllShapes)`}>
                    <g style={translatedStyle}>
                        {shouldShow && clonedChild}
                    </g>
                </g>
            );
        } else { // off
            return (
                <g style={rotatedStyle}>
                    {this.props.children}
                </g>
            );
        }
    },
    render() {
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
        if (mappingMode === 'oneFramePerGroup' || mappingMode === 'acrossGroups' || mappingMode === 'inFramesInGroups') {
            const mapperGroups = this.context.beatmathParameters.mapPlayaMapperGroups((group, groupIndex) => {
                const width = group.width * group.scaleFactor;
                const height = group.height * group.scaleFactor;
                const style = {
                    top: -height / 2,
                    left: -width / 2,
                    transform: this._serializeTransforms(group.transforms),
                    position: 'absolute',
                };
                return (
                    <svg key={groupIndex} style={style} width={width} height={height}>
                        {group.type === 'tower' && <rect fill="#000" x="0" y="0" height={height} width={width} />}
                        <g style={{transform: `scale(${group.scaleFactor}) translate(${group.width / 2}px, ${group.height / 2}px)`}}>
                            {this._renderDefs(groupIndex)}
                            {this._renderChildFrames(groupIndex, 1 / group.scaleFactor, -group.height / 4, group.type)}
                            {this._renderMasks()}
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
                            {this._renderMasks()}
                        </g>
                    </svg>
                </div>
            );
        }
    },
});

module.exports = BeatmathFrame;
