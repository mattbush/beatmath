require('regenerator/runtime');
// const _ = require('lodash');
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
        };
    },
    _renderDefs() {
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
    },
    _renderMasks() {
        if (location.href.endsWith('mapper')) {
            return null;
        }

        return this.context.beatmathParameters.mapMapperMasks((mapperShape, index) =>
            <polygon fill="#000" key={index} points={mapperShape.getPointsString()} />
        );
    },
    _renderChildFrames() {
        const frameRotation = this.getParameterValue('frameRotation');
        const frameScale = this.context.beatmathParameters.getFrameScale();
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
        } else { // off
            return (
                <g style={rotatedStyle}>
                    {this.props.children}
                </g>
            );
        }
    },
    render() {
        const width = this.getParameterValue('width');
        const height = this.getParameterValue('height');

        const persp = width * 0.52;
        const pitchAngle = 8.75;
        const dx = -10;
        const dy = -32;
        const scaleX = 0.956;
        const scaleY = 1.067;
        const rot = -0.75;

        const svgStyle = {
            transform: `rotate(${rot}deg) perspective(${persp}px) rotateX(${pitchAngle}deg) translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`,
        };

        const style = {
            transform: `translate(${width / 2}px, ${height / 2}px)`,
        };

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

        return (
            <div className="main">
                <svg width={width} height={height} style={svgStyle}>
                    <g style={style}>
                        {this._renderDefs()}
                        {this._renderChildFrames()}
                        {this._renderMasks()}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
