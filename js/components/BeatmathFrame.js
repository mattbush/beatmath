require('regenerator/runtime');
var React = require('react');
var ParameterBindingsMixin = require('js/components/ParameterBindingsMixin');

var BeatmathFrame = React.createClass({
    mixins: [ParameterBindingsMixin],
    contextTypes: {
        beatmathParameters: React.PropTypes.object,
    },
    getParameterBindings: function() {
        return {
            'width': this.context.beatmathParameters.width,
            'height': this.context.beatmathParameters.height,
        };
    },
    render: function() {
        var width = this.getParameterValue('width');
        var height = this.getParameterValue('height');
        var transform = `translate(${width / 2}, ${height / 2})`;
        if (this.props.disableTransform) {
            transform = null;
        }

        return (
            <div className="main">
                <svg width={width} height={height}>
                    <g transform={transform}>
                        {this.props.children}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
