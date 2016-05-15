require('regenerator/runtime');
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
        };
    },
    render: function() {
        const width = this.getParameterValue('width');
        const height = this.getParameterValue('height');
        const frameRotation = this.getParameterValue('frameRotation');
        const frameScale = this.getParameterValue('frameScale');
        const transitionPeriod = this.context.beatmathParameters.tempo.getBasePeriod() / 16;
        const style = {
            transform: `translate(${width / 2}px, ${height / 2}px) rotate(${frameRotation}deg) scale(${frameScale})`,
            transition: `transform ${transitionPeriod}ms linear`,
        };
        return (
            <div className="main">
                <svg width={width} height={height}>
                    <g style={style}>
                        {this.props.defs &&
                            <defs>
                                {this.props.defs}
                            </defs>
                        }
                        {this.props.children}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
