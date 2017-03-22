const React = require('react');

const MapperCurrentShapeView = React.createClass({
    contextTypes: {
        mapperParameters: React.PropTypes.object,
    },
    render: function() {
        const shape = this.props.shape;
        const cursorIndex = this.context.mapperParameters.getCursorIndex();
        const numPoints = shape.getNumPoints();
        const index0 = (0 + cursorIndex) % numPoints;
        const index1 = (1 + cursorIndex) % numPoints;
        const index2 = (2 + cursorIndex) % numPoints;
        return (
            <g>
                <polygon fill="#dd9966" points={shape.getPointsString()} />
                <circle fill="#ff0000" cx={shape.getX(index0)} cy={shape.getY(index0)} r={5} />
                <circle fill="#eedd00" cx={shape.getX(index1)} cy={shape.getY(index1)} r={5} />
                <circle fill="#00ff22" cx={shape.getX(index2)} cy={shape.getY(index2)} r={5} />
            </g>
        );
    },
});

module.exports = MapperCurrentShapeView;
