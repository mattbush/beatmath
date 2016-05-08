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
            frameScaleLog2: this.context.beatmathParameters.frameScaleLog2,
        };
    },
    render: function() {
        const width = this.getParameterValue('width');
        const height = this.getParameterValue('height');
        const frameRotation = Math.floor(this.getParameterValue('frameRotation'));
        const frameScale = Math.pow(2, this.getParameterValue('frameScaleLog2'));
        const style = {
            transform: `translate(${width / 2}px, ${height / 2}px) rotate(${frameRotation}deg) scale(${frameScale})`,
            transition: `transform ${0.05}s ease-out`,
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
