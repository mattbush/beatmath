const React = require('react');

const MapperCurrentShapeView = React.createClass({
    render: function() {
        const shape = this.props.shape;
        return (
            <g>
                <polygon fill="#dd9966" points={shape.getPointsString()} />
                <circle fill="#ff0000" cx={shape.getX(0)} cy={shape.getY(0)} r={5} />
                <circle fill="#eedd00" cx={shape.getX(1)} cy={shape.getY(1)} r={5} />
                <circle fill="#00ff22" cx={shape.getX(2)} cy={shape.getY(2)} r={5} />
            </g>
        );
    },
});

module.exports = MapperCurrentShapeView;
