require('regenerator/runtime');
var React = require('react');

const {WIDTH_PX, DESIRED_HEIGHT_PX} = require('js/parameters/BeatmathConstants.js');

var BeatmathFrame = React.createClass({
    render: function() {
        return (
            <div className="main">
                <svg width={WIDTH_PX} height={DESIRED_HEIGHT_PX} className="brickGrid">
                    <g transform={`translate(${WIDTH_PX / 2}, ${DESIRED_HEIGHT_PX / 2})`}>
                        {this.props.children}
                    </g>
                </svg>
            </div>
        );
    },
});

module.exports = BeatmathFrame;
