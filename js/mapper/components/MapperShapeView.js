const React = require('react');

const MapperShapeView = React.createClass({
    render: function() {
        return (
            <polygon fill="#ffffff" points={this.props.shape.getPointsString()} />
        );
    },
});

module.exports = MapperShapeView;
