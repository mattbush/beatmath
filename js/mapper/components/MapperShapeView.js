const React = require('react');

const MapperShapeView = React.createClass({
    render: function() {
        const fill = this.props.shape.isMask() ? '#555555' : '#999999';
        return (
            <polygon fill={fill} points={this.props.shape.getPointsString()} />
        );
    },
});

module.exports = MapperShapeView;
