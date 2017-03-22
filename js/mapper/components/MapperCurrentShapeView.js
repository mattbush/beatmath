const React = require('react');
const {posMod} = require('js/core/utils/math');

const MapperCurrentShapeView = React.createClass({
    contextTypes: {
        mapperParameters: React.PropTypes.object,
    },
    render: function() {
        const shape = this.props.shape;
        const cursorIndex = this.context.mapperParameters.getCursorIndex();
        const numPoints = shape.getNumPoints();
        const index0 = posMod(0 + cursorIndex, numPoints);
        const index1 = posMod(1 + cursorIndex, numPoints);
        const index2 = posMod(2 + cursorIndex, numPoints);
        const circleStyle = {
            transition: 'all 200ms ease-out',
        };

        return (
            <g>
                <polygon fill="#dd9966" points={shape.getPointsString()} />
                <circle style={circleStyle} fill="#ff0000" cx={shape.getX(index0)} cy={shape.getY(index0)} r={5} />
                <circle style={circleStyle} fill="#eedd00" cx={shape.getX(index1)} cy={shape.getY(index1)} r={5} />
                <circle style={circleStyle} fill="#00ff22" cx={shape.getX(index2)} cy={shape.getY(index2)} r={5} />
            </g>
        );
    },
});

module.exports = MapperCurrentShapeView;
