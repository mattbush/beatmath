const React = require('react');

const MapperShapeView = React.createClass({
    render: function() {
        return (
            <polygon fill="#999999" points={this.props.shape.getPointsString()} />
        );
    },
});

module.exports = MapperShapeView;
