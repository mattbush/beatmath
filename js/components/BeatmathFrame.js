require('regenerator/runtime');
var React = require('react');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants.js');

var BeatmathFrame = React.createClass({
    render: function() {
        var transform = `translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`;
        if (this.props.disableTransform) {
            transform = null;
        }

        return (
            <div className="main">
                <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX}>
                    <g transform={transform}>
                        {this.props.children}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
