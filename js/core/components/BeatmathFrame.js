require('regenerator/runtime');
var React = require('react');
var ParameterBindingsMixin = require('js/core/components/ParameterBindingsMixin');

var BeatmathFrame = React.createClass({
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
        var width = this.getParameterValue('width');
        var height = this.getParameterValue('height');
        var frameRotation = Math.floor(this.getParameterValue('frameRotation'));
        var frameScale = Math.pow(2, this.getParameterValue('frameScaleLog2'));
        var style = {
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
