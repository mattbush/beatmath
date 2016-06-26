require('regenerator/runtime');
const _ = require('underscore');
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
    _renderChildFrames() {
        const frameRotation = this.getParameterValue('frameRotation');
        const frameScale = this.getParameterValue('frameScale') * this.getParameterValue('frameScaleAutoupdating');
        const transitionPeriod = this.context.beatmathParameters.tempo.getBasePeriod() / 16;
        const style = {
            transform: `rotate(${frameRotation}deg) scale(${frameScale})`,
            transition: `transform ${transitionPeriod}ms linear`,
        };

        return _.times(1, index => {
            const clonedChild = React.cloneElement(React.Children.only(this.props.children), {

            });

            return (
                <g key={index} style={style}>
                    {clonedChild}
                </g>
            );
        });
    },
    render: function() {
        const width = this.getParameterValue('width');
        const height = this.getParameterValue('height');
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
                <svg width={width} height={height}>
                    <g style={style}>
                        {this._renderDefs()}
                        {this._renderChildFrames()}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
